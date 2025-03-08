import { redisClient } from "../../configs/redis.config";
import { HttpResponse } from "../../constants/responseMessage.constants";
import { HttpStatus } from "../../constants/status.constants";
import { IUserModel } from "../../models/user.model";
import { IUserRepository } from "../../repositories/interface/IUserRepository";
import { IUser } from "../../types/user.types";
import { comparePassword, hashPassword } from "../../utils/bcrypt.util";
import generateOtp from "../../utils/generate-otp.util";
import { createHttpsError } from "../../utils/httpError.utils";
import { generateAccesToken, generateRefreshToken } from "../../utils/jwt.util";
import { sendOtp } from "../../utils/sendOtp.utils";
import { IAuthService } from "../interface/IAuthService";

export class AuthService implements IAuthService {
    constructor(private _userRepository: IUserRepository) { }

    async signup(user: IUser): Promise<string> {
        const isUserExist = await this._userRepository.findByEmail(user.email)

        if (isUserExist) {
            throw createHttpsError(HttpStatus.CONFLICT, HttpResponse.USER_EXIST)
        }

        user.password = await hashPassword(user.password as string)

        const otp = generateOtp()

        await sendOtp(user.email, otp)

        const response = await redisClient.set(user.email,  JSON.stringify({
            ...user,
            otp
        }) , {EX : 300})


        if (!response) {
            throw createHttpsError(HttpStatus.INTERNAL_SERVER_ERROR, HttpResponse.SERVER_ERROR);
        }
        return user.email

    }


    async signin(email: string, password: string): Promise<{ accessToken: string; refreshToken: string; }> {
         const user = await this._userRepository.findByEmail(email)
         if(!user){
            throw createHttpsError(HttpStatus.NOT_FOUND,HttpResponse.USER_NOT_FOUND)
         }

         const isMatch = await comparePassword(password,user.password)

         if(!isMatch){
            throw createHttpsError(HttpStatus.UNAUTHORIZED , HttpResponse.INVALID_CREDENTIALS)
         }

         const payload = {_id : user._id , role : user.role , email : user.email}

         const accessToken = generateAccesToken(payload)
         const refreshToken = generateRefreshToken(payload)
         return {accessToken , refreshToken}
    }
    async verifyOtp(otp: string, email: string): Promise<{accessToken : string , refreshToken : string}> {
      const storedDataString = await redisClient.get(email)

      if(!storedDataString){
        throw createHttpsError(HttpStatus.NOT_FOUND , HttpResponse.OTP_EXPIRED)
      }

      const storedData = JSON.parse(storedDataString)

 
      if(storedData.otp !== otp){
        throw createHttpsError(HttpStatus.BAD_REQUEST , HttpResponse.OTP_INCORRECT)
      }


      const user = {
        username : storedData.username,
        email : storedData.email,
        password : storedData.password,
        role :"student" 
      }
      const newUser= await this._userRepository.create(user as IUserModel)
      await redisClient.del(email)
      if (!newUser) throw createHttpsError(HttpStatus.CONFLICT, HttpResponse.USER_CREATION_FAILED)
        const payload = {_id : newUser._id , role : newUser.role , email : newUser.email}

    
         const accessToken = generateAccesToken(payload)
         const refreshToken = generateRefreshToken(payload)
         return {accessToken , refreshToken}
    }
}