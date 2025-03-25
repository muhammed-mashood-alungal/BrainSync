import { BaseRepository } from "../base.repositry";
import { ISessionTypes } from "../../types/session.types";
import { ISessionRepository } from "../interface/ISessionRepository";
import Session, { ISessionModal } from "../../models/session.modal";
import { ObjectId, Types } from "mongoose";

export class SessionRepository extends BaseRepository<ISessionModal> implements ISessionRepository {
    constructor() {
        super(Session)
    }
    async createSession(data: Partial<ISessionTypes>): Promise<ISessionModal> {
        return await this.create(data)
    }
    async getSessionByCode(code: string): Promise<ISessionModal | null> {
        return await this.model.findOne({ code: code }).populate('createdBy').populate('groupId')
    }
    async getGroupsSessions(groups: Types.ObjectId[]): Promise<ISessionModal[]> {
        return await this.model.find({ groupId: { $in: groups } }).populate("createdBy").populate('groupId')
    }
    async getAllSessions(): Promise<ISessionModal[]> {
        return await this.model.find({}).populate("createdBy").populate('groupId')
    }
}