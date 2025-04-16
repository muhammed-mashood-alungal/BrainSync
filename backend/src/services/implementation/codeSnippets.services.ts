import { Types } from 'mongoose';
import { ICodeSnippetModel } from '../../models/codeSnippet.model';
import { ICodeSnippetRepository } from '../../repositories/interface/ICodeSnippetRepository';
import { ICodeSnippetSercvices } from '../interface/ICodeSnippeService';
import { createHttpsError } from '../../utils/httpError.utils';
import { HttpStatus } from '../../constants/status.constants';
import { ISessionRepository } from '../../repositories/interface/ISessionRepository';

export class CodeSnippetServices implements ICodeSnippetSercvices {
  constructor(private _codeSnippetRepo: ICodeSnippetRepository , private _sesssionRepo : ISessionRepository) {}

  async saveCodeSnippet(
    codeData: Partial<ICodeSnippetModel> & { sessionCode: string }
  ): Promise<ICodeSnippetModel> {

    const sessionData = await this._sesssionRepo.getSessionByCode(codeData.sessionCode)
    if(!sessionData){
        throw createHttpsError(
            HttpStatus.BAD_REQUEST,
            'Invalid Session COde'
          );
    }
    const isExist = await this._codeSnippetRepo.getCodeByTitleandUserId(
      codeData.createdBy as Types.ObjectId,
      codeData.title as string,
      sessionData?._id as Types.ObjectId
    );

    if (isExist) {
      throw createHttpsError(
        HttpStatus.CONFLICT,
        'Code Snippet With This Title Already Exist on your Resources.Try Another One'
      );
    }
    return this._codeSnippetRepo.saveCodeSnippet({...codeData,sessionId : sessionData?._id as Types.ObjectId});
  }
  async getUserCodeSnippets(
    userId: unknown,
    query: string,
    skip: unknown,
    limit: unknown
  ): Promise<{ snippets: ICodeSnippetModel[]; count: number }> {
    return this._codeSnippetRepo.getUserCodeSnippets(
      userId as Types.ObjectId,
      query,
      skip as number,
      limit as number
    );
  }
}
