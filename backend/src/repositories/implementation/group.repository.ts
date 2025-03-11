import { Types, UpdateQuery } from "mongoose";
import Group, { IGroupModel } from "../../models/group.model";
import { BaseRepository } from "../base.repositry";
import { IGroupRepository } from "../interface/IGroupRepository";

export class GroupRepository extends BaseRepository<IGroupModel> implements IGroupRepository {
    constructor() {
        super(Group)
    }
    async createGroup(data: Partial<IGroupModel>): Promise<IGroupModel> {
        return await this.create(data)
    }
    async leftGroup(groupId: Types.ObjectId, userId: Types.ObjectId): Promise<Boolean> {
        await this.findByIdAndUpdate(groupId, { $pull: { members: userId } })
        return true
    }
    async addToGroup(groupId: Types.ObjectId, members: Types.ObjectId[]): Promise<Boolean> {
        await this.findByIdAndUpdate(groupId,  { $addToSet: { members: { $each: members } } })
        return true
    }

    async getGroupData(groupId: Types.ObjectId): Promise<IGroupModel | null> {
        return await this.findById(groupId)
    }

    async getMyGroups(userId: Types.ObjectId): Promise<IGroupModel[]> {
        return await this.model.find({ members: userId, isActive: true }).populate('createdBy').populate('members')
    }
    async getAllGroups(): Promise<IGroupModel[]> {
        return await this.model.find().populate('createdBy').populate('members')
    }
    async handleActivation(groupId : Types.ObjectId) : Promise<Boolean>{
        const groupData =  await this.findById(groupId)
        console.log(groupData?.isActive)
        if(groupData){
            groupData.isActive = !groupData?.isActive
            await groupData.save()
            console.log(groupData?.isActive)
        }
        return true

    }
}