import { GridFSBucketReadStream } from 'mongodb';
import { INoteTypes } from '../../types/note.types';

export interface INoteService {
    writeNoteService(roomId: string, userId: string, content: string) : Promise<void>
    saveNoteService(sessionId : string , userId : string) : Promise<{pdfFileId : string}>
    getNotePdf(fileId: string) :Promise<GridFSBucketReadStream>
    getInitialContent(roomId:string, userId : string ) : Promise<string>
    myNotes(userId : unknown , query : string) : Promise<INoteTypes[]>
}  