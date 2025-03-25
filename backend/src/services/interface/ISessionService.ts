import { ISessionModal } from "../../models/session.modal";

export interface ISessionServices {
    createSession(data : Partial<ISessionModal>, userId : string ) : Promise<ISessionModal>
    createSessionCode(date : Date): string
    getMySessions(userId : unknown) : Promise<ISessionModal[]>
    getAllSessions() : Promise<ISessionModal[]>
    validateSession(sessionCode : string  , userId:unknown) : Promise<{status : boolean , message : string}>
    updateSession(sessionData : ISessionModal , sessionId : unknown , userId : unknown ) : Promise<ISessionModal | null>
}