import { NextFunction, Request, Response } from 'express';

export interface IUserController {
  changeProfilePic(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  getUserData(req: Request, res: Response, next: NextFunction): Promise<void>;
  editUsername(req: Request, res: Response, next: NextFunction): Promise<void>;
  changePassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  getAllStudents(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  searchUserByEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  getUserSessionProgress(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  getProfileStats(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  getProfilePhoto(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
