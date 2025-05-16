import { IGroupModel } from "../models/group.model"
import { IUserModel } from "../models/user.model"
import { mapUsers } from "./user.mappers"

export const groupMapper = (group : IGroupModel) =>{
    return {
        _id : group._id,
        name : group.name,
        createdBy : mapUsers(group.createdBy as IUserModel),
        members : (group.members as IUserModel[]).map(mapUsers),
        isActive : group.isActive,
        createdAt : group.createdAt
    }
}