import { BaseRepository } from "../base.repositry";
import { ISessionTypes } from "../../types/session.types";
import { ISessionRepository } from "../interface/ISessionRepository";
import Session, { ISessionModal } from "../../models/session.modal";
import { ObjectId, Types } from "mongoose";


interface IFilter {
    subject? : string;
    date? : {}
}

export class SessionRepository extends BaseRepository<ISessionModal> implements ISessionRepository {
    constructor() {
        super(Session)
    }
    async findById(id: Types.ObjectId): Promise<ISessionModal | null> {
        return await this.model.findById(id).populate('createdBy').populate('groupId')
    }
    async createSession(data: Partial<ISessionTypes>): Promise<ISessionModal> {
        return await this.create(data)
    }
    async getSessionByCode(code: string): Promise<ISessionModal | null> {
        return await this.model.findOne({ code: code }).populate('createdBy').populate('groupId')
    }
    async getGroupsSessions(groups: Types.ObjectId[], filter : IFilter): Promise<ISessionModal[]> {
        return await this.model.find({...filter, groupId: { $in: groups } }).sort({createdAt : -1}).populate("createdBy").populate('groupId')
    }
    async getAllSessions(): Promise<ISessionModal[]> {
        return await this.model.find({}).populate("createdBy").populate('groupId')
    }
    async update(newData: ISessionModal , sessionId : Types.ObjectId): Promise<ISessionModal | null> {
        return await this.model.findByIdAndUpdate(sessionId,{
            $set : newData
        },{new :true}).populate(['createdBy' , 'groupId'])
    }
}