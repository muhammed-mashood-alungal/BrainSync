import { Types } from 'mongoose';
import { IGroupModel } from '../../models/group.model';

export interface IGroupService {
  createGroup(data: Partial<IGroupModel>): Promise<IGroupModel>;
  addToGroup(groupId: unknown, members: unknown[]): Promise<void>;
  leftFromGroup(groupId: unknown, userId: unknown): Promise<void>;
  allGroups(): Promise<IGroupModel[]>;
  myGroups(userId: unknown): Promise<IGroupModel[]>;
  groupData(id: unknown): Promise<IGroupModel | null>;
  handleGroupActivation(groupId: unknown): Promise<Boolean>;
  totalGroupCount():Promise<number>
}
