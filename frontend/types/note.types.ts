import { ISessionTypes } from "./sessionTypes"
import { IUserType } from "./userTypes"

export interface INoteTypes {
    sessionId:  ISessionTypes
    userId: IUserType
    pdfFileId:string
    createdAt?: Date
    updatedAt? :Date
}