import { sessionInstances } from "@/axios/createInstance";
import { ISessionTypes } from "@/types/sessionTypes";
import { AxiosError } from "axios";


export const SessionServices = {
    async createSession(formData: Partial<ISessionTypes>): Promise<void> {
        try {
            const response = await sessionInstances.post('/create', formData)
            return response.data
        } catch (error) {
            const err = error as AxiosError<{ error: string }>
            const errorMessage = err.response?.data?.error || "Group Creation failed. Please try again."
            throw new Error(errorMessage)
        }
    }
}