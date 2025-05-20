import { Types } from 'mongoose';
import { IGroupModel } from '../../models/group.model';

export interface IGroupRepository {
  createGroup(data: Partial<IGroupModel>): Promise<IGroupModel>;
  leftGroup(groupId: Types.ObjectId, userId: Types.ObjectId): Promise<IGroupModel | null>;
  addToGroup(
    groupId: Types.ObjectId,
    members: Types.ObjectId[]
  ): Promise<IGroupModel | null>;
  getGroupData(groupId: Types.ObjectId): Promise<IGroupModel | null>;
  getMyGroups(userId: Types.ObjectId): Promise<IGroupModel[]>;
  getAllGroups(): Promise<IGroupModel[]>;
  handleGroupActivation(groupId: Types.ObjectId): Promise<Boolean>;
  totalGroupsofUser(userId :unknown) :Promise<number>
  getTotalGroupCount() :Promise<number>
  deleteGroup(groupId : Types.ObjectId) : Promise<IGroupModel | null>
  isAdminOfGroup(groupId :Types.ObjectId , userId : Types.ObjectId) :Promise<boolean>
  removeMember(groupId : Types.ObjectId , memberId : Types.ObjectId) : Promise<IGroupModel | null>
  editGroupName(groupId : Types.ObjectId , newName : string) : Promise<void>
}
