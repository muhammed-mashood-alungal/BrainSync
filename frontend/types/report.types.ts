import { ISessionTypes } from "./sessionTypes"
import { IUserType } from "./userTypes"


export interface IReportTypes {
    _id:string
    sessionId :   ISessionTypes
    reason : string
    type : 'Session' | 'Group'
    status?: 'Resolved' | 'Pending' | 'Closed' 
    createdAt : Date 
    reportedBy : IUserType
}
