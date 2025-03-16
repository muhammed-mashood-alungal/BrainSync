import { groupInstance } from "@/axios/createInstance"
import { IGroupType } from "@/types/groupTypes";
import { IUserType } from "@/types/userTypes";
import { AxiosError } from "axios";




export const GroupServices = {
     createNewGroup: async (groupName: string, members: string[], userId: string): Promise<void> => {
        try {
            const response = await groupInstance.post('/', { name :groupName, members , createdBy : userId})
            return response.data
        } catch (error) {
            const err = error as AxiosError<{ error: string }>
            const errorMessage = err.response?.data?.error || "Group Creation failed. Please try again."
            throw new Error(errorMessage)
        }
    },
    getMyGroups : async (userId : string) : Promise<{groups : IUserType[]}> => {
        try {
            const response = await groupInstance.get(`/my-groups/${userId}`,)
            return response.data
        } catch (error) {
            const err = error as AxiosError<{ error: string }>
            const errorMessage = err.response?.data?.error || "Your Groups Loading Failed. Please try again."
            throw new Error(errorMessage)
        }
    },
    addToGroup : async (groupId : string , members : string[]) : Promise<IGroupType[]> => {
        try {
            const response = await groupInstance.put(`/${groupId}/add-members`, {members})
            return response.data
        } catch (error) {
            const err = error as AxiosError<{ error: string }>
            const errorMessage = err.response?.data?.error || "Add to group  failed. Please try again."
            throw new Error(errorMessage)
        }
    },
    leftGroup : async (groupId : string , userId : string) : Promise<void> => {
        try {
            const response = await groupInstance.put(`/left-group/${groupId}`, {userId})
            return response.data
        } catch (error) {
            const err = error as AxiosError<{ error: string }>
            const errorMessage = err.response?.data?.error || "Left from group failed. Please try again."
            throw new Error(errorMessage)
        }
    },
    deactivate: async (groupId : string): Promise<void> => {
        try {
            const response = await groupInstance.put(`/${groupId}/handle-activation`, {groupId})
            return response.data
        } catch (error) {
            const err = error as AxiosError<{ error: string }>
            const errorMessage = err.response?.data?.error || "Group Creation failed. Please try again."
            throw new Error(errorMessage)
        }
    }
}