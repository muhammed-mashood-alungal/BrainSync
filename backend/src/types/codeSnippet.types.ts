import { Types } from "mongoose";

export interface ICodeSnippetTypes{
        title: string,                 // user-defined name like "My sorting algo"
        language: string,             // e.g. "javascript"
        sourceCode: string,           // the actual code
        createdBy: Types.ObjectId, 
        sessionId : Types.ObjectId
}