import { Types } from "mongoose";


export interface IReportTypes {
    sessionId : string | Types.ObjectId
    reason : string
    type : 'Session' | 'Group'
    status?: 'Resolved' | 'Pending' | 'Closed' 
    createdAt : Date 
    reportedBy : String
}
