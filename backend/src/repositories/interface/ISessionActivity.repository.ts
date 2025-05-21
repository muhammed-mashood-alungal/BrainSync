import { ObjectId, Types } from "mongoose";
import { ISessionActivityModel } from "../../models/sessionActivity.model";

export interface ISessionActivityRepository {
    addTimeSpend(userId:Types.ObjectId , sessionCode :string ,  duration : number, log :  { joinTime: Date; leaveTime: Date; duration: number }) : Promise<void>
    getUserSessionProgress(userId: Types.ObjectId , filterBy : string) : Promise<{ graph : any}>
    totalTimeSendByUser(userId : Types.ObjectId) : Promise<string>
    totalSessionAttendedByUser(userId : Types.ObjectId) :Promise<number>
    getSessionActivities(sessionCode: string): Promise<ISessionActivityModel[]> 
}