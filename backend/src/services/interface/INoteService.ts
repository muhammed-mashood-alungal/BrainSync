import { GridFSBucketReadStream } from 'mongodb';
import { INoteTypes } from '../../types/note.types';
import { INoteModel } from '../../models/note.model';

export interface INoteService {
    writeNoteService(roomId: string, userId: string, content: string) : Promise<void>
    saveNoteService(sessionId : string , userId : string) : Promise<{pdfFileId : string}>
    getNotePdf(fileId: string) :Promise<GridFSBucketReadStream>
    getInitialContent(roomId:string, userId : string ) : Promise<string>
    myNotes(userId: unknown, query: string , skip : unknown , limit : unknown) : Promise<{notes : INoteModel[] ,count : number}>
}  