import { Profile } from "passport";
import { IUserModel } from "../../models/user.model";



export interface IUserRepository {
    create(user : IUserModel) : Promise<IUserModel>;

    findByEmail(email :string) : Promise<IUserModel | null>

    findOrCreateUser(user : Profile) :Promise<IUserModel | null>
    
    //findOneWithUsernameOrEmail(value : string) : Promise<IUserModel | null>

   // updatePassword(email : string , hashedPassword : string) : Promise<IUserModel | null >
}