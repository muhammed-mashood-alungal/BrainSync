import { cookies } from 'next/headers'
import { IGroupType } from "@/types/groupTypes"
import { groupInstance } from '@/axios/createInstance';

export const dynamic = 'force-dynamic'



export async function getAllGroupsServer(): Promise<IGroupType[]> {
    try {
        const cookieStore =await cookies();
        const accessToken = cookieStore.get('accessToken')?.value
        const refreshToken = cookieStore.get('refreshToken')?.value

        const cookieString = [
            accessToken ? `accessToken=${accessToken}` : '',
            refreshToken ? `refreshToken=${refreshToken}` : ''
          ].filter(Boolean).join('; ');

        const response = await groupInstance.get('/', {
            headers: {
                "Authorization": accessToken ? `Bearer ${accessToken}` : '',
                "Cookie": cookieString
            }
        })


        return response.data?.groups;
    } catch (error) {
        console.error("Error fetching groups:", error)
        throw new Error("Loading all groups failed. Please try again.")
    }
}

export async function getGroupDataServer(groupId: string): Promise<IGroupType> {
    try {
        const cookieStore = await cookies()
        const accessToken = cookieStore.get('accessToken')?.value
        const refreshToken = cookieStore.get('refreshToken')?.value

        const cookieString = [
            accessToken ? `accessToken=${accessToken}` : '',
            refreshToken ? `refreshToken=${refreshToken}` : ''
        ].filter(Boolean).join('; ')

        const response = await groupInstance.get(`'${groupId}`, {
            headers: {
                "Authorization": accessToken ? `Bearer ${accessToken}` : '',
                "Cookie": cookieString
            }
        })
        return response.data
     
    } catch (error) {
        console.error("Error fetching group data:", error)
        throw new Error("Loading Group Data failed. Please try again.")
    }
}