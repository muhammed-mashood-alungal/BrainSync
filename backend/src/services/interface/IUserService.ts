import { IUser } from "../../types/user.types"

export interface IUserService {
    changeProfilePic(userId : unknown , fileUrl : Express.Multer.File) : Promise<Boolean>  
    getUserData(userId : unknown ) : Promise<Omit<IUser , 'password'> | null> 
    editUsername(userId: unknown , newName : string): Promise<Boolean> 
    updatePassword(userId : unknown , oldPass  :string, newPass : string): Promise<Boolean>
}