import { Profile } from "passport";
import { IUserModel } from "../../models/user.model";
import { Types } from "mongoose";



export interface IUserRepository {
    createUser(user : IUserModel) : Promise<IUserModel>
    findUserByEmail(email :string) : Promise<IUserModel | null>
    findOrCreateUser(user : Profile) :Promise<IUserModel | null>
    updatePassword(email : string , hashedPassword : string) : Promise<IUserModel | null >
    findByUserId(id: Types.ObjectId): Promise<IUserModel | null>
    searchUserByEmail(query : string ) :Promise<{email :string , _id : Types.ObjectId}[]>
    deleteAvatar(userId : Types.ObjectId ) :Promise<string  | undefined>
    findAllStudents(skip : number , limit : number , searchQuery: string)  : Promise<IUserModel[]>
    countStudents(searchQuery: string) : Promise<number>
}