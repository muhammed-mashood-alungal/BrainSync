import mongoose, { Types } from 'mongoose';
import { INoteRepository } from '../interface/INoteRepository';
import { set, ref, get, onValue, Unsubscribe } from 'firebase/database';
import { firebaseDB } from '../../configs/firebase.config';

import { GridFSBucket } from 'mongodb';
import mongoDBConfig from '../../configs/mongo.config';
import { BaseRepository } from '../base.repositry';
import { INoteModel, Notes } from '../../models/note.model';
import { GridFSBucketReadStream } from 'mongodb';


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

  async uploadPdfToGridFS(
    buffer: Buffer,
    fileName: string
  ): Promise<Types.ObjectId> {
    if (!this.gfs) {
      this.gfs = await mongoDBConfig.getGridFSBucket();
    }

    const uploadStream = this.gfs.openUploadStream(fileName, {
      contentType: 'application/pdf',
    });

    return new Promise((resolve, reject) => {
      uploadStream.on('error', reject);
      uploadStream.on('finish', () => resolve(uploadStream.id as Types.ObjectId));
      uploadStream.end(buffer);
    });
  }

  async deletePdfByName(fileName: string): Promise<void> {
    const existingFiles = await this.findFilesByName(fileName);
    for (const file of existingFiles) {
      await this.deleteFile(file._id);
    }
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
