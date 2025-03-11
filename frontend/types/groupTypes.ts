import { IUserType } from "./userTypes"

export interface IGroupType {
    _id:string,
    name :string,
    createdBy: IUserType,
    members : IUserType[],
    isActive : boolean,
    createdAt? : Date
    updatedAt? : Date
}