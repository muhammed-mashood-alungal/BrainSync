
import  {   adminInstance, userInstances } from "@/axios/createInstance";
import { AxiosError } from "axios";

export const AdminServices = {
    blockOrUnBlockStudent : async (studentId :string) => {
        try {
            const response = await adminInstance.put(`/block-unblock-student/${studentId}`)
            return response.data.students
        } catch (error: unknown) {
            const err = error as AxiosError<{ error: string }>
            const errorMessage = err.response?.data?.error || "Change Profile Picture failed. Please try again."
            throw new Error(errorMessage)
        }
    }
}