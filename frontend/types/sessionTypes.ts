import { IGroupType } from "./groupTypes"

export interface ISessionTypes {
    sessionName: string,
    subject: string,
    date: string | Date,
    startTime: Date | string ,
    endTime : Date | string,
    sessionLink : string,
    status : string,
    groupId : string | IGroupType
}