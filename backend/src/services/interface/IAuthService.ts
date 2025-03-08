import { IUser } from "../../types/user.types";

export interface IAuthService {
    signup(user : IUser) : Promise<string>
    signin(email : string , password : string) : Promise<{accessToken :string  , refreshToken : string}>
    verifyOtp(otp : string , email : string) : Promise<{accessToken : string , refreshToken : string}>
    
}