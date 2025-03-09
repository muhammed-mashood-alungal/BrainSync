import {  userInstances } from "@/axios/createInstance";
import { AxiosError } from "axios";

export const UserServices = {
     changeProfilePic:async (data: FormData, userId: string) => {
        try {
            const response = await userInstances.put(`/change-profile-photo/${userId}`, data)
            return response.data 
        } catch (error: unknown) {
            const err = error as AxiosError<{ error: string }>
            const errorMessage = err.response?.data?.error || "Change Profile Picture failed. Please try again."
            throw new Error(errorMessage)
        }
    },
    getUserData :  async (userId :string) =>{
        try{  
            const response = await userInstances.get(`/${userId}`)
            console.log(response)
            return response.data?.user
        }catch(error :unknown){
            const err = error as AxiosError<{ error: string }>
            const errorMessage = err.response?.data?.error || "Change Profile Picture failed. Please try again."
            throw new Error(errorMessage)
        }
    },
    editUsername :  async (userId :string , username : string) =>{
        try{  
            const response = await userInstances.put(`/edit-username/${userId}` , {username})
            console.log(response)
            return response.data?.user
        }catch(error :unknown){
            const err = error as AxiosError<{ error: string }>
            const errorMessage = err.response?.data?.error || "Change Profile Picture failed. Please try again."
            throw new Error(errorMessage)
        }
    },
    changePassword : async (userId :string , oldPass : string , newPass : string) =>{
        try{  
            const response = await userInstances.put(`/change-password/${userId}` , {oldPass , newPass})
            return response.data
        }catch(error :unknown){
            const err = error as AxiosError<{ error: string }>
            const errorMessage = err.response?.data?.error || "Change Profile Picture failed. Please try again."
            throw new Error(errorMessage)
        }
    }
}