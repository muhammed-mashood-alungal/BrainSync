import { cookies } from 'next/headers'
import { sessionInstances } from '@/axios/createInstance';
import { AxiosError } from 'axios';

export const dynamic = 'force-dynamic'

export const getMySessions = async () => {
    try {
        const cookieStore = await cookies();
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

    } catch (err) {

    }
}



export const getAllSessions = async () => {
    try {
        const cookieStore = await cookies();
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

    } catch (err) {

    }
}

export const validateSession = async (sessionId: string) => {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken')?.value
        const refreshToken = cookieStore.get('refreshToken')?.value

        const cookieString = [
            accessToken ? `accessToken=${accessToken}` : '',
            refreshToken ? `refreshToken=${refreshToken}` : ''
        ].filter(Boolean).join('; ')

        const response = await sessionInstances.get(`/validate/${sessionId}`, {
            headers: {
                "Authorization": accessToken ? `Bearer ${accessToken}` : '',
                "Cookie": cookieString
            }
        })
        return response.data.result

    } catch (err:unknown) {
        const error = err as AxiosError<{ error: string }>
        return {status : false , message : error.response?.data || "UnExpected Error Occured"}
    }
}