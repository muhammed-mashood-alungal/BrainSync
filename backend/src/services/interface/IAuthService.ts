import { Condition } from "mongoose";
import { IUser } from "../../types/user.types";
import { JwtPayload } from "jsonwebtoken";
import { IUserModel } from "../../models/user.model";

export interface IAuthService {
    signup(user : IUser) : Promise<string>
    signin(email : string , password : string) : Promise<{accessToken :string  , refreshToken : string}>
    verifyOtp(otp : string , email : string) : Promise<{accessToken : string , refreshToken : string}>
    resendOtp(email: string):Promise<string> 
    refreshAccessToken(token: string): Promise<{newAccessToken : string, payload : JwtPayload}>
    authMe(token: string): JwtPayload  | string 
    generateTokens(user : IUserModel) : {accessToken:string , refreshToken :string}
    forgotPassword(email :string) :Promise<{status : number , message : string}>
    resetPassword(token: string , password : string) : Promise<Boolean>
} 