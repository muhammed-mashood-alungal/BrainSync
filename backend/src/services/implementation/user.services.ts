import { Multer } from "multer";
import { UserRepository } from "../../repositories/implementation/user.repository";
import { IUserService } from "../interface/IUserService";
import { deleteImage, handleUpload } from "../../utils/imageUpload.util";
import { Mongoose, Types, Unpacked } from "mongoose";
import { createHttpsError, HttpError } from "../../utils/httpError.utils";
import { IUser } from "../../types/user.types";
import { comparePassword, hashPassword } from "../../utils/bcrypt.util";
import { HttpStatus } from "../../constants/status.constants";
import { HttpResponse } from "../../constants/responseMessage.constants";
export class UserServices implements IUserService {

    constructor(private _userRepository: UserRepository) { }

    async changeProfilePic(userId: unknown, file: Express.Multer.File): Promise<Boolean> {

        const response = await handleUpload(file)

        await this._userRepository.findByIdAndUpdate(userId as Types.ObjectId, { $set: { profilePicture: response } })

        return true
    }
    async getUserData(userId: unknown): Promise<Omit<IUser, 'password'> | null> {
        const userData = await this._userRepository.findById(userId as Types.ObjectId)
        return userData
    }
    async editUsername(userId: unknown, newName: string): Promise<Boolean> {
        await this._userRepository.findByIdAndUpdate(userId as Types.ObjectId, { $set: { username: newName } })
        return true
    }
    async updatePassword(userId: unknown, oldPass: string, newPass: string): Promise<Boolean> {
        const user = await this._userRepository.findById(userId as Types.ObjectId)
        const isMatch = await comparePassword(oldPass, user?.password as string)

        if (!isMatch) {
            throw createHttpsError(HttpStatus.UNAUTHORIZED, HttpResponse.OLD_PASS_NOT_MATCHED)
        }

        const hashedPassword = await hashPassword(newPass)

        await this._userRepository.updatePassword(user?.email as string, hashedPassword)
        return true
    }
    async getAllStudents(skip: unknown, limit: unknown ,searchQuery : string): Promise<{students : IUser[] , count : number}> {
        const sk = skip as number ?? 0
        const lim = limit as number ?? 100

        const [count , students ] =await Promise.all([ this._userRepository.countStudents(), this._userRepository.findAllStudents(sk, lim , searchQuery)] )
        return {students , count}
    }
    async blockOrUnblock(id: unknown): Promise<boolean> {
        const stud = await this._userRepository.findById(id as Types.ObjectId)
        if (!stud) throw createHttpsError(HttpStatus.NOT_FOUND, HttpResponse.USER_NOT_FOUND)
        stud.isAcitve = !stud?.isAcitve
        stud.save()
        return true
    }
    async isStudentsBlocked(id: unknown): Promise<boolean> {
        const stud = await this._userRepository.findById(id as Types.ObjectId)
        return stud?.isAcitve == false
    }
    async searchUserByEmail(query: string): Promise<{ email: string, _id: Types.ObjectId }[]> {
        return await this._userRepository.searchByEmail(query)
    }
    async deleteProfilePic(userId: unknown): Promise<Boolean> {

        const publicId = await this._userRepository.deleteAvatar(userId as Types.ObjectId)
        if (publicId) {
            await deleteImage(publicId)
        } else {
            throw createHttpsError(HttpStatus.INTERNAL_SERVER_ERROR, HttpResponse.SERVER_ERROR)
        }

        return true
    }
    
} 