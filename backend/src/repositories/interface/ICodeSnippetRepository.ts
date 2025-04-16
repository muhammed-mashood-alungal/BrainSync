import { Types } from 'mongoose';
import { ICodeSnippetModel } from '../../models/codeSnippet.model';

export interface ICodeSnippetRepository {
  saveCodeSnippet(
    codeData: Partial<ICodeSnippetModel>
  ): Promise<ICodeSnippetModel>;
  getUserCodeSnippets(
    userId: Types.ObjectId,
    query: string,
    skip: number,
    limit: number
  ): Promise<{ snippets: ICodeSnippetModel[]; count: number }>;
  getCodeByTitleandUserId(
    createdBy: Types.ObjectId,
    title: string,
    sessionId:  Types.ObjectId,
  ): Promise<ICodeSnippetModel | null>;
}
