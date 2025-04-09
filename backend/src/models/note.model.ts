
import mongoose, { Schema, Document } from 'mongoose';
import { INoteTypes } from '../types/note.types';

export interface INoteModel extends Document, INoteTypes { }

const NotesSchema = new Schema<INoteModel>({
    sessionId: { type: Schema.Types.ObjectId, required: true, unique: true , ref : "Session"},
    userId: { type: Schema.Types.ObjectId, required: true },
    pdfFileId: { type: Schema.Types.ObjectId, required: true }
},{
    timestamps : true
});

export const Notes = mongoose.model<INoteModel>('Note', NotesSchema)