import { cookies } from 'next/headers'
import { IGroupType } from "@/types/groupTypes"
import { groupInstance, sessionInstances } from '@/axios/createInstance';

export const dynamic = 'force-dynamic'

export const getMySessions =async ()=>{
    try{
        const cookieStore =await cookies();
        const accessToken = cookieStore.get('accessToken')?.value
        const refreshToken = cookieStore.get('refreshToken')?.value

        const cookieString = [
            accessToken ? `accessToken=${accessToken}` : '',
            refreshToken ? `refreshToken=${refreshToken}` : ''
          ].filter(Boolean).join('; ')
        
          const response = await sessionInstances.get('/my-sessions', {
            headers: {
                "Authorization": accessToken ? `Bearer ${accessToken}` : '',
                "Cookie": cookieString
            }
        })

        return response.data.sessions
        
    }catch(err){

    }
}



export const getAllSessions =async ()=>{
    try{
        const cookieStore =await cookies();
        const accessToken = cookieStore.get('accessToken')?.value
        const refreshToken = cookieStore.get('refreshToken')?.value

        const cookieString = [
            accessToken ? `accessToken=${accessToken}` : '',
            refreshToken ? `refreshToken=${refreshToken}` : ''
          ].filter(Boolean).join('; ')
        
          const response = await sessionInstances.get('/', {
            headers: {
                "Authorization": accessToken ? `Bearer ${accessToken}` : '',
                "Cookie": cookieString
            }
        })

        return response.data.sessions
        
    }catch(err){

    }
}