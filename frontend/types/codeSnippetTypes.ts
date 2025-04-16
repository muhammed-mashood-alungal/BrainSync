import { ISessionTypes } from "./sessionTypes";
import { IUserType } from "./userTypes";

export interface ICodeSnippetTypes {
  title: string;
  language: string;
  sourceCode: string;
  createdBy: string | IUserType;
  sessionId : string | ISessionTypes,
  createdAt? : Date 
}
