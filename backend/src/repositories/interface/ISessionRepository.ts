import { ObjectId, Types } from "mongoose";
import { ISessionModal } from "../../models/session.modal";
import { ISessionTypes } from "../../types/session.types";



export interface ISessionRepository {
     createSession(data: Partial<ISessionTypes>): Promise<ISessionModal>
     getSessionByCode(code: string): Promise<ISessionModal | null>
     getGroupsSessions(groups:Types.ObjectId[]): Promise<ISessionModal[]>
     getAllSessions() : Promise<ISessionModal[]>

}