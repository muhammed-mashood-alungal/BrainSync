import { Request, Response, NextFunction, response } from 'express';
import { UserServices } from '../../services/implementation/user.services';
import { IUserController } from '../interface/IUserController';
import { createHttpsError } from '../../utils/httpError.utils';
import { HttpStatus } from '../../constants/status.constants';
import { HttpResponse } from '../../constants/responseMessage.constants';
import { successResponse } from '../../utils/response';
import { Readable } from 'stream';

export class UserController implements IUserController {
  constructor(private _userServices: UserServices) {}
  async changeProfilePic(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const Image = req.file;
      const { userId } = req.params;
      if (!Image) {
        throw createHttpsError(
          HttpStatus.NOT_FOUND,
          HttpResponse.IMAGE_NOT_PROVIDED
        );
      }
      const imageUrl = await this._userServices.changeProfilePic(userId, Image);
      res.status(HttpStatus.OK).json(successResponse(HttpResponse.CREATED , {imageUrl}));
    } catch (error) {
      next(error);
    }
  }
  async getUserData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = req.params;
      const data = await this._userServices.getUserData(userId);
      res
        .status(HttpStatus.OK)
        .json(successResponse(HttpResponse.OK, { user: data }));
    } catch (error) {
      next(error);
    }
  }
  async editUsername(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { username } = req.body;
      const { userId } = req.params;

      await this._userServices.editUsername(userId, username);
      res.status(HttpStatus.OK).json(successResponse(HttpResponse.UPDATED));
    } catch (error) {
      next(error);
    }
  }
  async changePassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { oldPass, newPass } = req.body;
      const { userId } = req.params;
      await this._userServices.updatePassword(userId, oldPass, newPass);
      res.status(HttpStatus.OK).json(successResponse(HttpResponse.UPDATED));
    } catch (error) {
      next(error);
    }
  }
  async getAllStudents(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { skip, limit, searchQuery } = req.query;
      const { students, count } = await this._userServices.getAllStudents(
        skip,
        limit,
        searchQuery as string
      );
      res
        .status(HttpStatus.OK)
        .json(
          successResponse(HttpResponse.OK, { students: students, count: count })
        );
    } catch (error) {
      next(error);
    }
  }
  async blockOrUnblock(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { studentId } = req.params;
      await this._userServices.blockOrUnblockUser(studentId);

      res.status(HttpStatus.OK).json(successResponse(HttpResponse.UPDATED));
    } catch (error) {
      next(error);
    }
  }
  async searchUserByEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { query } = req.query;
      if (!query) {
        res.status(HttpStatus.OK).json({ users: [] });
        return;
      }

      const users = await this._userServices.searchUserByEmail(query as string);
      res

        .status(HttpStatus.OK)
        .json(successResponse(HttpResponse.OK, { users: users }));
    } catch (error) {
      next(error);
    }
  }

  async getProfilePhoto(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { userId } = req.params;
    const imageRes = await this._userServices.getProfilePhoto(userId);
    const contentType = imageRes.headers.get('content-type');

    res.setHeader('Content-Type', contentType);
    const nodeReadable = Readable.from(imageRes.body as any);
    nodeReadable.pipe(res);
  }
  async deleteAvatar(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = req.params;
      await this._userServices.deleteProfilePic(userId);
      res.status(HttpStatus.OK).json(successResponse(HttpResponse.UPDATED));
    } catch (error) {
      next(error);
    }
  }
  async getUserSessionProgress(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user;
      const { filterBy } = req.query;
      const { graph } = await this._userServices.getUserSessionProgress(
        userId,
        filterBy as string
      );
      res
        .status(HttpStatus.OK)
        .json(successResponse(HttpResponse.OK, { graph }));
    } catch (error) {
      next(error);
    }
  }
  async getProfileStats(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user;
      const stats = await this._userServices.getUserOverallStats(userId);
      res
        .status(HttpStatus.OK)
        .json(successResponse(HttpResponse.OK, { stats }));
    } catch (error) {
      next(error);
    }
  }
}
