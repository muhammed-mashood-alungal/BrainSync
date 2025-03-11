import { Profile } from "passport";
import { IUserModel } from "../../models/user.model";
import { Types } from "mongoose";



export interface IUserRepository {
    create(user : IUserModel) : Promise<IUserModel>;

    findByEmail(email :string) : Promise<IUserModel | null>

    findOrCreateUser(user : Profile) :Promise<IUserModel | null>
    
    updatePassword(email : string , hashedPassword : string) : Promise<IUserModel | null >
    findById(id: Types.ObjectId): Promise<IUserModel | null>
    searchByEmail(query : string ) :Promise<{email :string , _id : Types.ObjectId}[]>
    deleteAvatar(userId : Types.ObjectId ) :Promise<string  | undefined>
}