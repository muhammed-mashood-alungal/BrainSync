import { Types } from "mongoose"


export interface IGroupTypes {
    name :string,
    createdBy: Types.ObjectId,
    members : Types.ObjectId[],
    isActive : boolean,
    createdAt? : Date
    updatedAt? : Date
}