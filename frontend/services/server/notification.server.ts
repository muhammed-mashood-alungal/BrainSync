import { notificationInstance } from "@/axios/createInstance";
import { INotificationTypes } from "@/types/notificationTypes";
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic'



export async function getMyNotifications(): Promise<INotificationTypes[]> {
    try {
        const cookieStore =await cookies();
        const accessToken = cookieStore.get('accessToken')?.value
        const refreshToken = cookieStore.get('refreshToken')?.value

        const cookieString = [
            accessToken ? `accessToken=${accessToken}` : '',
            refreshToken ? `refreshToken=${refreshToken}` : ''
          ].filter(Boolean).join('; ');

        const response = await notificationInstance.get('/my-notifications', {
            headers: {
                "Authorization": accessToken ? `Bearer ${accessToken}` : '',
                "Cookie": cookieString
            }
        })


        return response.data?.notifications;
    } catch (error) {
        console.error("Error fetching groups:", error)
        throw new Error("Loading all Notifications failed. Please try again.")
    }
}