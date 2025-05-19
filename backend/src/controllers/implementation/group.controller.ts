import { Request, Response, NextFunction } from 'express';
import { IGroupService } from '../../services/interface/IGroupService';
import { IGroupController } from '../interface/IGroupController';
import { HttpStatus } from '../../constants/status.constants';
import { HttpResponse } from '../../constants/responseMessage.constants';
import { createHttpsError } from '../../utils/httpError.utils';
import { successResponse } from '../../utils/response';

export class GroupController implements IGroupController {
  constructor(private _groupServices: IGroupService) {}

  async createGroup(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data = req.body;
       const newGroup  = await this._groupServices.createGroup(data);
      res.status(HttpStatus.OK).json(successResponse(HttpResponse.CREATED , {newGroup : newGroup}));
    } catch (err) {
      next(err);
    }
  }
  async leftGroup(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { groupId } = req.params;
      const { userId } = req.body;
      await this._groupServices.leftFromGroup(groupId, userId);
      res.status(HttpStatus.OK).json(successResponse(HttpResponse.UPDATED));
    } catch (error) {
      next(error);
    }
  }
  async addToGroup(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { groupId } = req.params;
      const { members } = req.body;
      await this._groupServices.addToGroup(groupId, members);
      res.status(HttpStatus.OK).json(successResponse(HttpResponse.CREATED));
    } catch (error) {
      next(error);
    }
  }
  async getAllGroups(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const groups = await this._groupServices.allGroups();
      res
        .status(HttpStatus.OK)
        .json(successResponse(HttpResponse.OK, { groups: groups }));
    } catch (error) {
      next(error);
    }
  }
  async getMyGroups(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = req.params;
      if (userId == undefined) {
        throw createHttpsError(
          HttpStatus.NOT_FOUND,
          HttpResponse.USER_NOT_FOUND
        );
      }
      const groups = await this._groupServices.myGroups(userId);

      res
        .status(HttpStatus.OK)
        .json(successResponse(HttpResponse.OK, { groups: groups }));
    } catch (error) {
      next(error);
    }
  }

  async getGroupData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { groupId } = req.params;
      const group = await this._groupServices.groupData(groupId);
      res
        .status(HttpStatus.OK)
        .json(successResponse(HttpResponse.OK, { group: group }));
    } catch (error) {
      next(error);
    }
  }
  async handleGroupActivation(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { groupId } = req.params;
      const group = await this._groupServices.handleGroupActivation(groupId);
      res
        .status(HttpStatus.OK)
        .json(successResponse(HttpResponse.OK, { group: group }));
    } catch (error) {
      next(error);
    }
  }
  async deleteGroup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {groupId} = req.params;
      await this._groupServices.deleteGroup(groupId)
      res.status(HttpStatus.OK).json(successResponse(HttpResponse.OK))
    } catch (error) {
      next(error)
    }
  }

  async removeMember(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {groupId} = req.params
      const {  adminId , memberId} = req.body
      await this._groupServices.removeMember(groupId , adminId , memberId)
      res.status(HttpStatus.OK).json(successResponse(HttpResponse.OK))
    } catch (error) {
      next(error)
    }
  }

  async editGroupName(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { groupId} = req.params
      const {  newName , adminId } = req.body
      await this._groupServices.editGroupName(groupId , adminId ,newName)
      res.status(HttpStatus.OK).json(successResponse(HttpResponse.OK))
    } catch (error) {
      next(error)
    }
  } 
}
