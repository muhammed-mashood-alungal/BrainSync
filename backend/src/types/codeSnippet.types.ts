import { Types } from 'mongoose';

export interface ICodeSnippetTypes {
  title: string;
  language: string;
  sourceCode: string;
  createdBy: Types.ObjectId;
  sessionId: Types.ObjectId;
}


export type IMapppedCodeSnippet = Omit<ICodeSnippetTypes , 'createdBy'>