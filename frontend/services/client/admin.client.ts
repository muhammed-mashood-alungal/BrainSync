import { adminInstance, userInstances } from "@/axios/createInstance";
import { AxiosError } from "axios";

export const AdminServices = {
  blockOrUnBlockStudent: async (studentId: string) => {
    try {
      const response = await adminInstance.put(
        `/block-unblock-student/${studentId}`
      );
      return response.data.students;
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data?.error ||
        "Change Profile Picture failed. Please try again.";
      throw new Error(errorMessage);
    }
  },
  async getAllStudents(skip: number, limit: number, searchQuery: string) {
    try {
      const response = await adminInstance.get(
        `/all-students?skip=${skip}&limit=${limit}&searchQuery=${searchQuery}`
      );
      return response.data;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data?.error ||
        "Change Profile Picture failed. Please try again.";
      throw new Error(errorMessage);
    }
  },
  getDashboardData: async (days: number): Promise<any> => {
    try {
      const response = await adminInstance.get(`/get-dashboard-data?lastXDays=${days}`);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data?.error ||
        "Change Profile Picture failed. Please try again.";
      throw new Error(errorMessage);
    }
  },
};
