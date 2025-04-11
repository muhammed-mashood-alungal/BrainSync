import { Request, Response, NextFunction } from "express";
import { UserServices } from "../../services/implementation/user.services";
import { IUserController } from "../interface/IUserController";
import { createHttpsError } from "../../utils/httpError.utils";
import { HttpStatus } from "../../constants/status.constants";
import { HttpResponse } from "../../constants/responseMessage.constants";
import { successResponse } from "../../utils/response";

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
            res.status(HttpStatus.OK).json(successResponse(HttpResponse.CREATED))
        } catch (error) {
            next(error)
        }
    }
    async getUserData(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const { userId } = req.params
            const data = await this._userServices.getUserData(userId)
            res.status(HttpStatus.OK).json(successResponse(HttpResponse.OK , { user: data }))
        } catch (error) {
            next(error)
        }
    }
    async editUsername(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { username } = req.body
            const { userId } = req.params

            await this._userServices.editUsername(userId, username)
            res.status(200).json(successResponse(HttpResponse.UPDATED))
        } catch (error) {
            next(error)
        }
    }
    async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { oldPass, newPass } = req.body
            const { userId } = req.params
            await this._userServices.updatePassword(userId, oldPass, newPass)
            res.status(200).json(successResponse(HttpResponse.UPDATED))
        } catch (error) {
            next(error)
        }
    }
    async getAllStudents(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { skip, limit ,searchQuery } = req.query
            const { students, count } = await this._userServices.getAllStudents(skip, limit ,searchQuery as string)
            res.status(200).json(successResponse(HttpResponse.OK , { students: students, count: count }))
        } catch (error) {
            next(error)
        }
    }
    async blockOrUnblock(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { studentId } = req.params
            await this._userServices.blockOrUnblockUser(studentId)

            res.status(200).json(successResponse(HttpResponse.UPDATED))
        } catch (error) {
            next(error)
        }
    }
    async searchUserbyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { query } = req.query
            if (!query) {
                res.status(HttpStatus.OK).json({ users: [] })
                return
            }

            const users = await this._userServices.searchUserByEmail(query as string)
            res.status(HttpStatus.OK).json(successResponse( HttpResponse.OK,{users: users }))
        } catch (error) {
            next(error)
        }
    }
    async deleteAvatar(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { userId } = req.params
            await this._userServices.deleteProfilePic(userId)
            res.status(HttpStatus.OK).json(successResponse(HttpResponse.UPDATED))
        } catch (error) {
            next(error)
        }
    }

}