import mongoose, { Types } from 'mongoose';
import { INoteRepository } from '../../repositories/interface/INoteRepository';
import { INoteService } from '../interface/INoteService';
import { GridFSBucketReadStream } from 'mongodb';
import { ISessionRepository } from '../../repositories/interface/ISessionRepository';
import { INoteModel } from '../../models/note.model';
import * as cheerio from 'cheerio';
import * as stream from 'stream';
import PDFDocument from 'pdfkit';

export class NoteService implements INoteService {
  constructor(
    private _noteRepository: INoteRepository,
    private _sessionRepository: ISessionRepository
  ) {}
  async writeNoteService(
    roomId: string,
    userId: string,
    content: string
  ): Promise<void> {
    await this._noteRepository.writeNote(roomId, userId, content);
  }
  async saveNoteService(
    sessionCode: string,
    userId: string
  ): Promise<{ pdfFileId: string; status: boolean }> {
    const htmlContent = await this._noteRepository.getContentFromFirebase(
      sessionCode,
      userId
    );

    if (!htmlContent?.length) {
      return { pdfFileId: '', status: false };
    }

    const session = await this._sessionRepository.getSessionByCode(sessionCode);
    if (!session?._id) {
      return { pdfFileId: '', status: false };
    }

    const textContent = cheerio.load(htmlContent)('body').text().trim();

    if (!textContent.length) {
      return { pdfFileId: '', status: false };
    }

    const existingNote = await this._noteRepository.findNoteBySessionAndUser(
      session._id as Types.ObjectId,
      userId
    );

    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const bufferStream = new stream.PassThrough();
    const chunks: Buffer[] = [];

    bufferStream.on('data', chunk => chunks.push(chunk));
    const bufferPromise = new Promise<Buffer>(resolve => {
      bufferStream.on('end', () => resolve(Buffer.concat(chunks)));
    });

    doc.pipe(bufferStream);
    doc.fontSize(14).text(textContent, { align: 'left', lineGap: 5 });
    doc.end();

    const pdfBuffer = await bufferPromise;
    const fileName = `${session._id}-Note.pdf`;

    const newPdfFileId = await this._noteRepository.uploadPdfToGridFS(
      pdfBuffer,
      fileName
    );

    await this._noteRepository.createNote(
      session._id as Types.ObjectId,
      userId,
      newPdfFileId,
      session.sessionName
    );


    if (
      existingNote?.pdfFileId &&
      existingNote.pdfFileId.toString() !== newPdfFileId.toString()
    ) {
      await this._noteRepository.deletePdfById(existingNote.pdfFileId);
    }

    return { pdfFileId: newPdfFileId.toString(), status: true };
  }

  async getNotePdf(fileId: string): Promise<GridFSBucketReadStream> {
    const objectId = new mongoose.Types.ObjectId(fileId);
    return this._noteRepository.getPdfStream(objectId);
  }
  async getInitialContent(
    sessionCode: string,
    userId: string
  ): Promise<string> {
    return await this._noteRepository.getContentFromFirebase(
      sessionCode,
      userId
    );
  }
  async myNotes(
    userId: unknown,
    query: string,
    skip: unknown,
    limit: unknown
  ): Promise<{ notes: INoteModel[]; count: number }> {
    const { notes, count } = await this._noteRepository.myNotes(
      new mongoose.Types.ObjectId(userId as string),
      query,
      Number(skip) || 0,
      Number(limit) || 10
    );
    return { notes, count };
  }
}
