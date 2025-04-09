import { ObjectId, Types } from "mongoose";
import { ISessionModal } from "../../models/session.modal";
import { ISessionTypes } from "../../types/session.types";

interface IFilter {
     subject? : string;
     date? : {}
 }

export interface ISessionRepository {
     createSession(data: Partial<ISessionTypes>): Promise<ISessionModal>
     getSessionByCode(code: string): Promise<ISessionModal | null>
     getGroupsSessions(groups:Types.ObjectId[], filter : IFilter): Promise<ISessionModal[]>
     getAllSessions() : Promise<ISessionModal[]>
     update(newData :ISessionModal , sessionId  :Types.ObjectId) : Promise<ISessionModal |null>
     findById(id:Types.ObjectId) : Promise<ISessionModal |null>
     stopSession(sessionId :Types.ObjectId) : Promise<ISessionModal | null> 
}