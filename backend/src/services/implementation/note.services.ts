import mongoose, { Types } from "mongoose";
import { HttpResponse } from "../../constants/responseMessage.constants";
import { HttpStatus } from "../../constants/status.constants";
import { INoteRepository } from "../../repositories/interface/INoteRepository";
import { createHttpsError } from "../../utils/httpError.utils";
import { INoteService } from "../interface/INoteService";
import { GridFSBucketReadStream } from 'mongodb';
import { ISessionRepository } from "../../repositories/interface/ISessionRepository";

export class NoteService implements INoteService {
    constructor(private _noteRepository: INoteRepository , private _sessionRepository: ISessionRepository) { }
    async writeNoteService(roomId: string, userId: string, content: string): Promise<void> {
        await this._noteRepository.writeNote(roomId, userId, content)
    }
    async saveNoteService(sessionCode: string, userId: string): Promise<{ pdfFileId: string }> {
        const htmlContent = await this._noteRepository.getContentFromFirebase(sessionCode, userId)
        if (!htmlContent) createHttpsError(HttpStatus.BAD_REQUEST, HttpResponse.NO_CONTENT_FOR_PDF)

        const session = await this._sessionRepository.getSessionByCode(sessionCode)  
        

        const pdfFileId = await this._noteRepository.saveNoteAsPdf(htmlContent, session?._id as string)

        await this._noteRepository.createNote(session?._id as Types.ObjectId, userId, pdfFileId)
        return { pdfFileId: pdfFileId.toString() }
    }

    async getNotePdf(fileId: string) : Promise<GridFSBucketReadStream> {
        const objectId = new mongoose.Types.ObjectId(fileId);
        return this._noteRepository.getPdfStream(objectId);
    }
    async getInitialContent(sessionCode: string, userId: string): Promise<string> {
        return  await this._noteRepository.getContentFromFirebase(sessionCode, userId)
    }
}