import { ICodeSnippetModel } from '../../models/codeSnippet.model';
import { IMapppedCodeSnippet } from '../../types/codeSnippet.types';

export interface ICodeSnippetSercvices {
  saveCodeSnippet(
    codeData: Partial<ICodeSnippetModel>
  ): Promise<ICodeSnippetModel>;
  getUserCodeSnippets(
    userId: unknown,
    query: string,
    skip: unknown,
    limit: unknown
  ): Promise<{ snippets: IMapppedCodeSnippet[]; count: number }>;
}
