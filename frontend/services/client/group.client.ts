import { groupInstance } from "@/axios/createInstance";
import { IGroupType } from "@/types/groupTypes";
import { IUserType } from "@/types/userTypes";
import { AxiosError } from "axios";

export const GroupServices = {
  createNewGroup: async (
    groupName: string,
    members: string[],
    userId: string
  ): Promise<IGroupType> => {
    try {
      const response = await groupInstance.post("/", {
        name: groupName,
        members,
        createdBy: userId,
      });
      return response.data.newGroup;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data?.error || "Group Creation failed. Please try again.";
      throw new Error(errorMessage);
    }
  },
  getMyGroups: async (userId: string ,searchQuery? : string): Promise<IGroupType[]> => {
    try {
      const response = await groupInstance.get(`/my-groups/${userId}?searchQuery=${searchQuery}`);
      return response.data?.groups;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data?.error ||
        "Your Groups Loading Failed. Please try again.";
      throw new Error(errorMessage);
    }
  },
  addToGroup: async (
    groupId: string,
    members: string[]
  ): Promise<IGroupType[]> => {
    try {
      const response = await groupInstance.put(`/${groupId}/add-members`, {
        members,
      });
      return response.data;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data?.error || "Add to group  failed. Please try again.";
      throw new Error(errorMessage);
    }
  },
  leftGroup: async (groupId: string, userId: string): Promise<void> => {
    try {
      const response = await groupInstance.put(`/left-group/${groupId}`, {
        userId,
      });
      return response.data;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data?.error ||
        "Left from group failed. Please try again.";
      throw new Error(errorMessage);
    }
  },
  deactivate: async (groupId: string): Promise<void> => {
    try {
      const response = await groupInstance.put(
        `/${groupId}/handle-activation`,
        { groupId }
      );
      return response.data;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data?.error ||
        "Group Activation failed. Please try again.";
      throw new Error(errorMessage);
    }
  },
  deleteGroup: async (groupId: string): Promise<void> => {
    try {
      const response = await groupInstance.put(`/${groupId}/delete-group`);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data?.error || "Group Deletion failed. Please try again.";
      throw new Error(errorMessage);
    }
  },
  removeMemberfromGroup: async (
    groupId: string,
    adminId: string,
    memberId: string
  ): Promise<void> => {
    try {
      const response = await groupInstance.put(`/${groupId}/remove-member`, {
        adminId,
        memberId,
      });
      return response.data;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data?.error ||
        "Removing Member failed. Please try again.";
      throw new Error(errorMessage);
    }
  },
  editGroupName: async (
    groupId: string,
    adminId: string,
    newName: string
  ): Promise<void> => {
    try {
      const response = await groupInstance.put(`/${groupId}/edit-name`, {
        newName,
        adminId,
      });
      return response.data;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data?.error ||
        "Removing Member failed. Please try again.";
      throw new Error(errorMessage);
    }
  },
};
