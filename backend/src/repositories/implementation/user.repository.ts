import { IUserModel } from "../../models/user.model";
import { BaseRepository } from "../base.repositry";
import { IUserRepository } from "../interface/IUserRepository";
import User from "../../models/user.model";
import { Profile } from "passport";
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

}