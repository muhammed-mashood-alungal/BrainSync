import { Types } from 'mongoose';
import { IGroupModel } from '../../models/group.model';
import { IMappedGroupTypes } from '../../types/group.types';

export interface IGroupService {
  createGroup(data: Partial<IGroupModel>): Promise<IMappedGroupTypes>;
  addToGroup(groupId: unknown, members: unknown[]): Promise<void>;
  leftFromGroup(groupId: unknown, userId: unknown): Promise<void>;
  allGroups(): Promise<IMappedGroupTypes[]>;
  myGroups(userId: unknown , search : string): Promise<IMappedGroupTypes[]>;
  groupData(id: unknown): Promise<IMappedGroupTypes>;
  handleGroupActivation(groupId: unknown): Promise<Boolean>;
  totalGroupCount():Promise<number>
  deleteGroup(groupId : unknown) : Promise<void>
  removeMember(groupId : unknown , adminId : unknown , memberId : unknown) : Promise<void>
  editGroupName(groupId : unknown ,adminId : unknown, newName : unknown  ) : Promise<void>
}
