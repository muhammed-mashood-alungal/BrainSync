import { Types } from 'mongoose';
import CodeSnippet, { ICodeSnippetModel } from '../../models/codeSnippet.model';
import { BaseRepository } from '../base.repositry';
import { ICodeSnippetRepository } from '../interface/ICodeSnippetRepository';

export class CodeSnippetRepository
  extends BaseRepository<ICodeSnippetModel>
  implements ICodeSnippetRepository
{
  constructor() {
    super(CodeSnippet);
  }
  async saveCodeSnippet(
    codeData: Partial<ICodeSnippetModel>
  ): Promise<ICodeSnippetModel> {
    return await this.create(codeData);
  }
  async getUserCodeSnippets(
    userId: Types.ObjectId,
    query :string,
    skip : number ,
    limit:number
  ): Promise<{snippets : ICodeSnippetModel[] , count : number}> {

    let find: any = { createdBy: userId };
    if (query && query.trim().length) {
      find.title = { $regex: query, $options: 'i' };
    }
    const count = await this.model.countDocuments(find);

    const res = await this.model
      .find(find)
      .populate('sessionId')
      .skip(skip)
      .limit(limit);

    return { snippets: res, count: count };
  }
  async getCodeByTitleandUserId(
    createdBy: Types.ObjectId,
    title: string,
    sessionCode:  Types.ObjectId,
  ): Promise<ICodeSnippetModel | null> {
    return  await this.findOne({ createdBy, title, sessionCode });
  }
}
