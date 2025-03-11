import { Request, Response, NextFunction } from "express";
import { UserServices } from "../../services/implementation/user.services";
import { IUserController } from "../interface/IUserController";
import { createHttpsError } from "../../utils/httpError.utils";
import { HttpStatus } from "../../constants/status.constants";
import { HttpResponse } from "../../constants/responseMessage.constants";

export class UserController implements IUserController {
    constructor(private _userServices: UserServices) { }
    async changeProfilePic(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const Image = req.file
            const { userId } = req.params
            if (!Image) {
                throw createHttpsError(HttpStatus.NOT_FOUND, HttpResponse.IMAGE_NOT_PROVIDED)
            }

            await this._userServices.changeProfilePic(userId, Image)
            res.status(HttpStatus.OK).json(HttpResponse.CREATED)
        } catch (error) {
            next(error)
        }
    }
    async getUserData(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const { userId } = req.params

            const data = await this._userServices.getUserData(userId)
            res.status(HttpStatus.OK).json({ user: data })
        } catch (error) {
            next(error)
        }
    }
    async editUsername(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { username } = req.body
            const { userId } = req.params

            await this._userServices.editUsername(userId, username)
            res.status(200).json({ message: HttpResponse.UPDATED })
        } catch (error) {
            next(error)
        }
    }
    async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { oldPass, newPass } = req.body
            const { userId } = req.params
            await this._userServices.updatePassword(userId, oldPass, newPass)
            res.status(200).json({ message: HttpResponse.UPDATED })
        } catch (error) {
            next(error)
        }
    }
    async getAllStudents(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const students = await this._userServices.getAllStudents()
            res.status(200).json({ students: students })
        } catch (error) {
            next(error)
        }
    }
    async blockOrUnblock(req:Request , res: Response , next : NextFunction ) : Promise<void> {
        try {
            const {studentId} = req.params
            await this._userServices.blockOrUnblock(studentId)
            res.status(200).json({ message : HttpResponse.UPDATED })
        } catch (error) {
            next(error)
        }
    }
    async searchUserbyEmail(req:Request , res: Response , next : NextFunction ) : Promise<void> {
        try {
            const {query} = req.query
            if(!query){
                res.status(200).json({users : []})
                return
            }

            const users = await this._userServices.searchUserByEmail(query as string)
            res.status(200).json({ message : HttpResponse.UPDATED  , users:users})
        } catch (error) {
            next(error)
        }
    }

}