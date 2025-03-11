import User, { IUserModel } from "../../models/user.model";
import { BaseRepository } from "../base.repositry";
import { IUserRepository } from "../interface/IUserRepository";
import { Profile } from "passport";
import { createHttpsError } from "../../utils/httpError.utils";
import { HttpStatus } from "../../constants/status.constants";
import { HttpResponse } from "../../constants/responseMessage.constants";
import { Types } from "mongoose";

export class UserRepository extends BaseRepository<IUserModel> implements IUserRepository {
    constructor() {
        super(User)
    }

    async createUser(user: IUserModel): Promise<IUserModel> {
        try {
            return await this.create(user)
        } catch (error) {
            console.error(error)
            throw new Error('Error while Creating New User')
        }
    } 

    async findByEmail(email: string): Promise<IUserModel | null> {
        try {
            return await this.findOne({ email })
        } catch (error) {
            console.error(error)
            throw new Error('Error While Finding user by email')
        }
    }
    async findOrCreateUser(profile: Profile) {
        let user = await this.findOne({$or : [{googleId :profile.id} ,{email : profile.emails?.[0].value}]})
        
        if (!user) {
            user = await this.create({
                googleId: profile.id,
                email: profile.emails?.[0].value,
                username: profile.displayName,
            });
        }

        return user;
    }
    async findById(id: Types.ObjectId): Promise<IUserModel | null> {
        return await super.findById(id)
    }
    async updatePassword(email: string , hashedPassword : string): Promise<IUserModel | null> {
            const user = await this.findOne({ email })
            if(!user){
                 throw createHttpsError(HttpStatus.NOT_FOUND , HttpResponse.USER_NOT_FOUND)
            } 
            user.password = hashedPassword
            user.save()
            return user
    }
    async searchByEmail(query : string ) :Promise<{email :string , _id : Types.ObjectId}[]>{
        return await this.find({email : {$regex : query , $options : "i"} , isAcitve : true , role:'student'})
    }

}