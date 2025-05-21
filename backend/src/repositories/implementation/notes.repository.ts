import mongoose, { Types } from 'mongoose';
import { INoteRepository } from '../interface/INoteRepository';
import { set, ref, get, onValue, Unsubscribe } from 'firebase/database';
import { firebaseDB } from '../../configs/firebase.config';
import puppeteer from 'puppeteer';
import { GridFSBucket, ObjectId, ReturnDocument } from 'mongodb';
import mongoDBConfig from '../../configs/mongo.config';
import { BaseRepository } from '../base.repositry';
import { INoteModel, Notes } from '../../models/note.model';
import { INoteTypes } from '../../types/note.types';
import { GridFSBucketReadStream } from 'mongodb';
import * as cheerio from 'cheerio';
import * as stream from 'stream';
import PDFDocument from 'pdfkit';

export class NoteRepository
  extends BaseRepository<INoteModel>
  implements INoteRepository
{
  private gfs: GridFSBucket | null;
  constructor() {
    super(Notes);
    this.gfs = null;
  }

  async writeNote(
    roomId: string,
    userId: string,
    content: string
  ): Promise<void> {
    const noteRef = ref(firebaseDB, `notes/${roomId}/${userId}`);
    await set(noteRef, content);
  }
  async getContentFromFirebase(
    roomId: string,
    userId: string
  ): Promise<string> {
    const contentRef = ref(firebaseDB, `notes/${roomId}/${userId}`);
    const snapshot = await get(contentRef);
    return snapshot.val() || '';
  }

  // async saveNoteAsPdf(
  //   htmlContent: string,
  //   sessionId: string
  // ): Promise<Types.ObjectId | null> {
  //   if (!this.gfs) {
  //     this.gfs = await mongoDBConfig.getGridFSBucket();
  //   }
  //   if(!htmlContent?.length){
  //     return null
  //   }

  //   const browser = await puppeteer.launch({ headless: true });
  //   const page = await browser.newPage();

  //   await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
  //   const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
  //   await browser.close();
  //   const fileName = `${sessionId}.pdf`;

  //   const existingFiles = await this.findFilesByName(fileName);

  //   for (const file of existingFiles) {
  //     await this.deleteFile(file._id);
  //   }

  //   const updloadStream = await this.gfs.openUploadStream(fileName, {
  //     contentType: 'application/pdf',
  //   });

  //   return new Promise((resolve, reject) => {
  //     updloadStream.on('error', reject);
  //     updloadStream.on('finish', () => resolve(updloadStream.id));
  //     updloadStream.end(pdfBuffer);
  //   });
  // }
  async saveNoteAsPdf(
    htmlContent: string,
    sessionId: string
  ): Promise<Types.ObjectId | null> {
    if (!this.gfs) {
      this.gfs = await mongoDBConfig.getGridFSBucket();
    }
    if (!htmlContent?.length) {
      return null;
    }

    // Parse HTML content to extract text
    const $ = cheerio.load(htmlContent);
    const textContent = $('body').text().trim();

    // Create a PDF document
    const doc = new PDFDocument({
      margin: 50,
      size: 'A4',
    });

    // Create a buffer to store the PDF
    const bufferStream = new stream.PassThrough();
    const chunks: Buffer[] = [];

    bufferStream.on('data', chunk => chunks.push(chunk));

    const bufferPromise = new Promise<Buffer>(resolve => {
      bufferStream.on('end', () => {
        const pdfBuffer = Buffer.concat(chunks);
        resolve(pdfBuffer);
      });
    });

    // Pipe the PDF into the buffer stream
    doc.pipe(bufferStream);

    // Add content to the PDF
    doc.fontSize(14).text(textContent, {
      align: 'left',
      lineGap: 5,
    });

    // Finalize the PDF
    doc.end();

    // Wait for PDF creation to complete
    const pdfBuffer = await bufferPromise;

    const fileName = `${sessionId}.pdf`;

    // Delete existing files with the same name
    const existingFiles = await this.findFilesByName(fileName);
    for (const file of existingFiles) {
      await this.deleteFile(file._id);
    }

    // Upload the new PDF
    const uploadStream = await this.gfs.openUploadStream(fileName, {
      contentType: 'application/pdf',
    });

    return new Promise((resolve, reject) => {
      uploadStream.on('error', reject);
      uploadStream.on('finish', () => resolve(uploadStream.id));
      uploadStream.end(pdfBuffer);
    });
  }

  async getPdfStream(fileId: Types.ObjectId): Promise<GridFSBucketReadStream> {
    if (!this.gfs) {
      this.gfs = await mongoDBConfig.getGridFSBucket();
    }
    return this.gfs?.openDownloadStream(fileId);
  }

  async createNote(
    sessionId: Types.ObjectId,
    userId: string,
    pdfFileId: Types.ObjectId,
    sessionName: string
  ): Promise<void> {
    await this.model.updateOne(
      { sessionId, userId },
      { $set: { pdfFileId: pdfFileId, noteName: sessionName + '-note' } },
      { upsert: true }
    );
  }

  private async findFilesByName(fileName: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const files: any[] = [];
      this.gfs!.find({ filename: fileName })
        .toArray()
        .then(docs => resolve(docs))
        .catch(err => reject(err));
    });
  }

  private async deleteFile(fileId: Types.ObjectId): Promise<void> {
    return await this.gfs!.delete(fileId);
  }

  async myNotes(
    userId: Types.ObjectId,
    query: string,
    skip: number,
    limit: number
  ): Promise<{ notes: INoteModel[]; count: number }> {
    let find: any = { userId };
    if (query && query.trim().length) {
      find.noteName = { $regex: query, $options: 'i' };
    }
    const count = await this.model.countDocuments(find);

    const res = await this.model
      .find(find)
      .populate('sessionId')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    return { notes: res, count: count };
  }
}
