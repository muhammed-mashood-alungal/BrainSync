import { Types } from "mongoose"


export interface ISessionTypes {
    sessionName: string,
    subject: string,
    date: string | Date,
    startTime: Date ,
    endTime : Date,
    sessionLink : string,
    status : string,
    groupId : Types.ObjectId,
    createdBy : Types.ObjectId ,
    code : string
}