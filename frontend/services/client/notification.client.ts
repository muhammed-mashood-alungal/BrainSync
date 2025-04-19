import { notificationInstance } from "@/axios/createInstance"

export const notificationServices = {
    readAllNotifications: async ():Promise<void>=>{
      try {
        const response = await notificationInstance.put('/read-all')
      } catch (error) {
        console.log(error)
      }
    },
    readANotifications : async (notificationId : string) : Promise<void> =>{
        try {
            const response = await notificationInstance.put(`/read-notification/${notificationId}`)
        } catch (error) {
            console.log(error)
        }
    }
}