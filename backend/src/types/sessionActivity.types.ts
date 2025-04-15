import { Types } from "mongoose";

export interface ISessionActivity extends Document {
    userId : Types.ObjectId;
    sessionCode : string;
    totalDuration : number
    logs :[{
        joinTime : Date ;
        leaveTime : Date ;
        duration : number
    }]
}