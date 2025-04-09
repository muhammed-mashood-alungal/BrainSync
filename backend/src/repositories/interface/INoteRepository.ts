import { Types, Unpacked } from "mongoose"
import { GridFSBucketReadStream } from 'mongodb';
import { INoteTypes } from "../../types/note.types";

export interface INoteRepository {
    writeNote(roomId: string, userId: string, content: string) : Promise<void>
    getContentFromFirebase(roomId: string, userId : string): Promise<string>
    saveNoteAsPdf(htmlContent : string , sessionId :string) : Promise<Types.ObjectId>
    getPdfStream(fileId: Types.ObjectId) : Promise<GridFSBucketReadStream>
    createNote(sessionId : Types.ObjectId , userId : string , pdfFileId : Types.ObjectId) : Promise<void>
    myNotes(userId : Types.ObjectId , query : string ) : Promise<INoteTypes[]>
}