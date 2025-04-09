import { Types } from "mongoose"

export interface INoteTypes {
    sessionId: string | Types.ObjectId
    userId: string | Types.ObjectId
    pdfFileId:Types.ObjectId
    createdAt?: Date
    updatedAt? :Date
}