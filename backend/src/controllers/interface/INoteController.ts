import { NextFunction, Request, Response } from "express";

export interface INoteController {
    writeNote(req: Request , res: Response , next : NextFunction) : Promise<void>
    saveNote(req: Request , res: Response , next : NextFunction) : Promise<void>
    getNotePdf(req: Request , res: Response , next : NextFunction) : Promise<void>
    getInitialContent(req : Request , res : Response  , next : NextFunction) : Promise<void>
}