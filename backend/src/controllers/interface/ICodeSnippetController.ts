import { NextFunction, Request, Response } from 'express';

export interface ICodeSnippetController {
  saveCodeSnippet(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  getUserCodeSnippets(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
