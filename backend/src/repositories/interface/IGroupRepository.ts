import { Types } from 'mongoose';
import { IGroupModel } from '../../models/group.model';

export interface IGroupRepository {
  createGroup(data: Partial<IGroupModel>): Promise<IGroupModel>;
  leftGroup(groupId: Types.ObjectId, userId: Types.ObjectId): Promise<Boolean>;
  addToGroup(
    groupId: Types.ObjectId,
    members: Types.ObjectId[]
  ): Promise<Boolean>;
  getGroupData(groupId: Types.ObjectId): Promise<IGroupModel | null>;
  getMyGroups(userId: Types.ObjectId): Promise<IGroupModel[]>;
  getAllGroups(): Promise<IGroupModel[]>;
  handleGroupActivation(groupId: Types.ObjectId): Promise<Boolean>;
}
