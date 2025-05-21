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
import { INotificationservices } from '../interface/INotificationServices';

export class GroupServices implements IGroupService {
  constructor(
    private _groupRepository: IGroupRepository,
    private _userRepository: IUserRepository,
    private _notificationService: INotificationservices
  ) {}

  async createGroup(data: Partial<IGroupModel>): Promise<IMappedGroupTypes> {
    const newGroup = await this._groupRepository.createGroup(data);
    await this._notificationService.createGroupNotification(
      {
        title: 'New Group Created and Your were Added',
        message: `You are now a part of Group ${newGroup?.name}`,
        type: 'SUCCESS',
      },
      data.members?.filter((u: any) => u != data.createdBy) as Types.ObjectId[]
    );
    return groupMapper(newGroup);
  }

  async addToGroup(groupId: unknown, members: unknown[]): Promise<void> {
    const group = await this._groupRepository.addToGroup(
      groupId as Types.ObjectId,
      members as Types.ObjectId[]
    );

    await this._notificationService.createGroupNotification(
      {
        title: 'Added You',
        message: `You are now a part of Group ${group?.name}`,
        type: 'SUCCESS',
      },
      members as Types.ObjectId[]
    );
  }

  async leftFromGroup(groupId: unknown, userId: unknown): Promise<void> {
    const group = await this._groupRepository.leftGroup(
      groupId as Types.ObjectId,
      userId as Types.ObjectId
    );
    const userDetails = await this._userRepository.findByUserId(
      userId as Types.ObjectId
    );
    await this._notificationService.createNotification({
      title: 'Left From the Group',
      message: `${userDetails?.username} left from ${group?.name}`,
      type: 'WARNING',
      userId: group?.createdBy as Types.ObjectId,
    });
  }

  async allGroups(): Promise<IMappedGroupTypes[]> {
    const groups = await this._groupRepository.getAllGroups();
    return groups.map(groupMapper);
  }

  async myGroups(userId: unknown , search : string): Promise<IMappedGroupTypes[]> {
    const groups = await this._groupRepository.getMyGroups(
      userId as Types.ObjectId,
      search
    );
    return groups.map(groupMapper);
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
    return await this._groupRepository.getTotalGroupCount();
  }
  async deleteGroup(groupId: unknown): Promise<void> {
    const group = await this._groupRepository.deleteGroup(
      groupId as Types.ObjectId
    );
    await this._notificationService.createGroupNotification(
      {
        title: 'Group Deleted',
        message: `${group?.name} is Deleted by its Admin`,
        type: 'INFO',
      },
      group?.members as Types.ObjectId[]
    );
  }
  async removeMember(
    groupId: unknown,
    adminId: unknown,
    memberId: unknown
  ): Promise<void> {
    const isAdmin = await this._groupRepository.isAdminOfGroup(
      groupId as Types.ObjectId,
      adminId as Types.ObjectId
    );
    if (!isAdmin)
      throw createHttpsError(
        HttpStatus.UNAUTHORIZED,
        HttpResponse.UNAUTHORIZED
      );
    const group = await this._groupRepository.removeMember(
      groupId as Types.ObjectId,
      memberId as Types.ObjectId
    );

    await this._notificationService.createNotification({
      userId: memberId as Types.ObjectId,
      title: 'Removed From Group',
      message: `You have removed from ${group?.name} by Admin `,
      type: 'INFO',
    });
  }
  async editGroupName(
    groupId: unknown,
    adminId: unknown,
    newName: unknown
  ): Promise<void> {
    const isAdmin = await this._groupRepository.isAdminOfGroup(
      groupId as Types.ObjectId,
      adminId as Types.ObjectId
    );
    if (!isAdmin)
      throw createHttpsError(
        HttpStatus.UNAUTHORIZED,
        HttpResponse.UNAUTHORIZED
      );
    await this._groupRepository.editGroupName(
      groupId as Types.ObjectId,
      newName as string
    );
  }
}
