import { IGroupType } from "./groupTypes"
import { IUserType } from "./userTypes"

export interface ISessionTypes {
    _id :string
    sessionName: string,
    subject: string,
    date: string | Date,
    startTime: Date | string ,
    endTime : Date | string,
    sessionLink : string,
    status : string,
    groupId : string | IGroupType
    code : string
    createdBy : string | IUserType
}