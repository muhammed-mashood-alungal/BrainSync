import { noteInstances } from "@/axios/createInstance"
import { AxiosError } from "axios"

export const noteServices = {
    writeNote: async (roomId: string, userId: string, content: string): Promise<boolean> => {
        try {
            const response = await noteInstances.post(`/write/${roomId}/${userId}`, { content })
            return true
        } catch (error) {
            return false
        }
    },
    saveNote: async (roomId: string): Promise<{success: boolean , message? : string}> => {
        try {
            const response = await noteInstances.post(`/save/${roomId}`)
            console.log(response)
            return {success: true }
        } catch (error) {
            const err = error as AxiosError<{ error: string }>
            const errorMessage = err.response?.data?.error || "Note Saving failed. Please try again."
            return {success: false , message : errorMessage}
            //throw new Error(errorMessage)
        }
    },
    getInitialContent: async (roomId :string ) : Promise<string> =>{
        try {
            const response = await noteInstances.get(`/initial-content/${roomId}`)
            console.log(response)
            return response?.data?.content
        } catch (error) {
            const err = error as AxiosError<{ error: string }>
            const errorMessage = err.response?.data?.error || "Note Saving failed. Please try again."
            throw new Error(errorMessage)
        }
    }
}