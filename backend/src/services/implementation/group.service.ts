import { Types } from 'mongoose';
import { IGroupModel } from '../../models/group.model';
import { IGroupRepository } from '../../repositories/interface/IGroupRepository';
import { IGroupService } from '../interface/IGroupService';
import { createHttpsError } from '../../utils/httpError.utils';
import { HttpStatus } from '../../constants/status.constants';
import { HttpResponse } from '../../constants/responseMessage.constants';
import { IUserRepository } from '../../repositories/interface/IUserRepository';
import { groupMapper } from '../../mappers/group.mapper';
import { IMappedGroupTypes } from '../../types/group.types';

export class GroupServices implements IGroupService {
  constructor(
    private _groupRepository: IGroupRepository,
    private _userRepository: IUserRepository
  ) {}

  async createGroup(data: Partial<IGroupModel>): Promise<IMappedGroupTypes> {
    const newGroup =  await this._groupRepository.createGroup(data);
    return groupMapper(newGroup)
  }

  async addToGroup(groupId: unknown, members: unknown[]): Promise<void> {
    await this._groupRepository.addToGroup(
      groupId as Types.ObjectId,
      members as Types.ObjectId[]
    );
  }

  async leftFromGroup(groupId: unknown, userId: unknown): Promise<void> {
    await this._groupRepository.leftGroup(
      groupId as Types.ObjectId,
      userId as Types.ObjectId
    );
  }

  async allGroups(): Promise<IMappedGroupTypes[]> {
    const groups =  await this._groupRepository.getAllGroups();
    return groups.map(groupMapper)
  }

  async myGroups(userId: unknown): Promise<IMappedGroupTypes[]> {
    const groups = await this._groupRepository.getMyGroups(userId as Types.ObjectId);
    return groups.map(groupMapper)
  }

  async groupData(id: unknown): Promise<IMappedGroupTypes> {
    const result = await this._groupRepository.getGroupData(
      id as Types.ObjectId
    );
    if (!result) {
      throw createHttpsError(
        HttpStatus.NOT_FOUND,
        HttpResponse.RESOURCE_NOT_FOUND
      );
    }
    return groupMapper(result);
  }

  async handleGroupActivation(groupId: unknown): Promise<Boolean> {
    const result = await this._groupRepository.handleGroupActivation(
      groupId as Types.ObjectId
    );
    return result;
  }
  async totalGroupCount(): Promise<number> {
    return await this._groupRepository.getTotalGroupCount()
  }
}
