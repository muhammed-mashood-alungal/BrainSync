import { Types } from "mongoose"
import { IGroupTypes } from "./group.types"
import { IGroupModel } from "../models/group.model"


export interface ISessionTypes {
    sessionName: string,
    subject: string,
    date: string | Date,
    startTime: Date ,
    endTime : Date,
    sessionLink : string,
    status : string,
    groupId : Types.ObjectId | IGroupTypes,
    createdBy : Types.ObjectId ,
    code : string
}