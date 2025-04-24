import { Types, Unpacked } from 'mongoose';
import { GridFSBucketReadStream } from 'mongodb';
import { INoteTypes } from '../../types/note.types';
import { INoteModel } from '../../models/note.model';

export interface INoteRepository {
  writeNote(roomId: string, userId: string, content: string): Promise<void>;
  getContentFromFirebase(roomId: string, userId: string): Promise<string>;
  saveNoteAsPdf(
    htmlContent: string,
    sessionId: string
  ): Promise<Types.ObjectId | null>;
  getPdfStream(fileId: Types.ObjectId): Promise<GridFSBucketReadStream>;
  createNote(
    sessionId: Types.ObjectId,
    userId: string,
    pdfFileId: Types.ObjectId,
    sessionName: string
  ): Promise<void>;
  myNotes(
    userId: Types.ObjectId,
    query: string,
    skip: number,
    limit: number
  ): Promise<{ notes: INoteModel[]; count: number }>;
}
