import { ISessionModal } from "../../models/session.modal";

export interface ISessionServices {
    createSession(data : Partial<ISessionModal>, userId : string ) : Promise<ISessionModal>
    createSessionCode(date : Date): string
}