import { ICodeSnippetModel } from '../../models/codeSnippet.model';

export interface ICodeSnippetSercvices {
  saveCodeSnippet(
    codeData: Partial<ICodeSnippetModel>
  ): Promise<ICodeSnippetModel>;
  getUserCodeSnippets(
    userId: unknown,
    query: string,
    skip: unknown,
    limit: unknown
  ): Promise<{ snippets: ICodeSnippetModel[]; count: number }>;
}
