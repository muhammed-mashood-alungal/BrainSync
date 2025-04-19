import { Request, Response, NextFunction } from 'express';
import { IGroupService } from '../../services/interface/IGroupService';
import { ISessionServices } from '../../services/interface/ISessionService';
import { IUserService } from '../../services/interface/IUserService';
import { IAdminController } from '../interface/IAdminController';
import { HttpStatus } from '../../constants/status.constants';
import { successResponse } from '../../utils/response';
import { HttpResponse } from '../../constants/responseMessage.constants';

export class AdminController implements IAdminController {
  constructor(
    private _userServices: IUserService,
    private _groupServices: IGroupService,
    private _sessionServices: ISessionServices
  ) {}

  async getDashboardData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
        const { lastXDays } = req.query;

    const totalUsers = await this._userServices.totalUsersCount();
    const totalGroups = await this._groupServices.totalGroupCount();
    const totalSessions = await this._sessionServices.totalSessionCount();
    const totalStudyTime = await this._sessionServices.getTotalSessionTime();

    const sessionCreationTrend =
      await this._sessionServices.getSessionCreationTrend(lastXDays as string);

   // const {freeUsers , premiumUsers} = await this._userServices.freePaidUserCount()

    const result ={
        totalUsers,
        totalGroups,
        totalSessions,
        totalStudyTime,
        sessionCreationTrend,
        // freeUsers,
        // premiumUsers
    }
    res.status(HttpStatus.OK).json(successResponse(HttpResponse.OK , {...result}))
    } catch (error) {
        next(error)
    }
    
  }
}
