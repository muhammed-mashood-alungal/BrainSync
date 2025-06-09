import { Types, UpdateQuery } from 'mongoose';
import Group, { IGroupModel } from '../../models/group.model';
import { BaseRepository } from '../base.repositry';
import { IGroupRepository } from '../interface/IGroupRepository';

export class GroupRepository
  extends BaseRepository<IGroupModel>
  implements IGroupRepository
{
  constructor() {
    super(Group);
  }
  async createGroup(data: Partial<IGroupModel>): Promise<IGroupModel> {
    return await this.create(data);
  }
  async leftGroup(
    groupId: Types.ObjectId,
    userId: Types.ObjectId
  ): Promise<IGroupModel | null> {
    return await this.model.findByIdAndUpdate(
      groupId,
      { $pull: { members: userId } },
      { new: true }
    );
  }
  async addToGroup(
    groupId: Types.ObjectId,
    members: Types.ObjectId[]
  ): Promise<IGroupModel | null> {
    const group = await this.model.findByIdAndUpdate(
      groupId,
      {
        $addToSet: { members: { $each: members } },
      },
      { new: true }
    );
    return group;
  }

  async getGroupData(groupId: Types.ObjectId): Promise<IGroupModel | null> {
    return await this.model.findById(groupId).populate('members');
  }

  async getMyGroups(
    userId: Types.ObjectId,
    search: string
  ): Promise<IGroupModel[]> {
    const query: any = {
      members: userId,
      isActive: true,
      isDeleted: false,
    };

    if (search && search?.trim()) {
      query.name = { $regex: search, $options: 'i' };
    }
    return await this.model
      .find(query)
      .populate('createdBy')
      .populate('members')
      .sort({ createdAt: -1 });
  }
  async getAllGroups(): Promise<IGroupModel[]> {
    return await this.model.find().populate('createdBy').populate('members');
  }
  async handleGroupActivation(groupId: Types.ObjectId): Promise<Boolean> {
    const groupData = await this.findById(groupId);
    if (groupData) {
      groupData.isActive = !groupData?.isActive;
      await groupData.save();
    }
    return true;
  }
  async totalGroupsofUser(userId: unknown): Promise<number> {
    return this.model.countDocuments({ members: userId, isActive: true });
  }
  async getTotalGroupCount(): Promise<number> {
    return await this.model.countDocuments({});
  }
  async deleteGroup(groupId: Types.ObjectId): Promise<IGroupModel | null> {
    return await this.model.findByIdAndUpdate(
      groupId,
      {
        $set: {
          isDeleted: true,
        },
      },
      { new: true }
    );
  }
  async removeMember(
    groupId: Types.ObjectId,
    memberId: Types.ObjectId
  ): Promise<IGroupModel | null> {
    return await this.model.findByIdAndUpdate(
      groupId,
      {
        $pull: { members: memberId },
      },
      { new: true }
    );
  }

  async editGroupName(groupId: Types.ObjectId, newName: string): Promise<void> {
    await this.findByIdAndUpdate(groupId, {
      $set: {
        name: newName,
      },
    });
  }
  async isAdminOfGroup(
    groupId: Types.ObjectId,
    userId: Types.ObjectId
  ): Promise<boolean> {
    const group = await this.findById(groupId);
    return group?.createdBy == userId;
  }
}
