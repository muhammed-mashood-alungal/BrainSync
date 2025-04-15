import { ObjectId, Types } from "mongoose";

export interface ISessionActivityRepository {
    addTimeSpend(userId:Types.ObjectId , sessionCode :string ,  duration : number, log :  { joinTime: Date; leaveTime: Date; duration: number }) : Promise<void>
    getUserSessionProgress(userId: Types.ObjectId , filterBy : string) : Promise<{ graph : any}>
}