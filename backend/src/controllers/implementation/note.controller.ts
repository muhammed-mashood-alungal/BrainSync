import { NextFunction, Request, Response } from "express";
import { INoteController } from "../interface/INoteController";
import { INoteService } from "../../services/interface/INoteService";
import { successResponse } from "../../utils/response";
import { HttpResponse } from "../../constants/responseMessage.constants";
import { HttpStatus } from "../../constants/status.constants";

export class NoteController implements INoteController {
    constructor(private _noteServices: INoteService) { }

    async writeNote(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { roomId, userId } = req.params
            const { content } = req.body
            await this._noteServices.writeNoteService(roomId, userId, content)
            res.status(HttpStatus.CREATED).json(successResponse(HttpResponse.CREATED))
        } catch (err) {
            next(err)
        }
    }
    async saveNote(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { sessionCode } = req.params
            const userId = req.user
            if (!sessionCode) {
                res.status(HttpStatus.BAD_REQUEST).json(HttpResponse.SESSION_ID_NOT_PROVIDED);
                return;
            }

            const { pdfFileId } = await this._noteServices.saveNoteService(sessionCode, userId as string)
            const downloadUrl = `${req.protocol}://${req.get('host')}/api/notes/pdf/${pdfFileId}`

            res.status(HttpStatus.CREATED).json(successResponse(HttpResponse.CREATED, { downloadUrl }))
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
    async getNotePdf(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { fileId } = req.params
            const pdfStream = await this._noteServices.getNotePdf(fileId)
            res.set('Content-Type', 'application/pdf')
            res.set('Content-Disposition', `attachment; filename="note-${fileId}.pdf"`)
            pdfStream.pipe(res)
        } catch (error) {
            next(error)
        }
    }
    async getInitialContent(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { sessionCode } = req.params
            const userId = req.user
            const content = await this._noteServices.getInitialContent(sessionCode, userId as string)
            res.status(HttpStatus.OK).json(successResponse(HttpResponse.OK, { content }))
        } catch (error) {
            next(error)
        }
    }
    async myNotes(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {searchQuery ,skip , limit} = req.query
            const userId = req.user
            const {notes , count} =await this._noteServices.myNotes(userId ,searchQuery as string,skip as string , limit as string)
            
            res.status(HttpStatus.OK).json(successResponse(HttpResponse.OK, { notes : notes  , count}))
        } catch (error) {                                                                                                                                                                                                                                                                                                                                                                                  
            next(error)
        }
    }
}