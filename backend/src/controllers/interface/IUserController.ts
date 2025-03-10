import { NextFunction, Request, Response } from "express";

export  interface  IUserController {
    changeProfilePic(req:Request , res: Response , next : NextFunction) : Promise<void>
    getUserData(req:Request , res: Response , next : NextFunction) : Promise<void>
    editUsername(req:Request , res : Response , next : NextFunction) : Promise<void>
    changePassword(req: Request, res: Response, next: NextFunction): Promise<void>
    getAllStudents(req: Request, res: Response, next: NextFunction): Promise<void>
} 