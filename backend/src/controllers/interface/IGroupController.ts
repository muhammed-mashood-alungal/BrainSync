import { NextFunction, Request, Response } from 'express';

export interface IGroupController {
  createGroup(req: Request, res: Response, next: NextFunction): Promise<void>;
  leftGroup(req: Request, res: Response, next: NextFunction): Promise<void>;
  addToGroup(req: Request, res: Response, next: NextFunction): Promise<void>;
  getAllGroups(req: Request, res: Response, next: NextFunction): Promise<void>;
  getGroupData(req: Request, res: Response, next: NextFunction): Promise<void>;
  getMyGroups(req: Request, res: Response, next: NextFunction): Promise<void>;
  handleGroupActivation(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
