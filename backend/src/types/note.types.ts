import { Types } from 'mongoose';
import { ISessionTypes } from './session.types';

export interface INoteTypes {
  sessionId: string | Types.ObjectId | ISessionTypes;
  userId: string | Types.ObjectId;
  pdfFileId: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  noteName: string;
}
