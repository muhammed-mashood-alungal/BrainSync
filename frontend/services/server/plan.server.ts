
import { plansInstances } from "@/axios/createInstance";
import { cookies } from "next/headers";


export const dynamic = 'force-dynamic'

export const getActivePremuimPlans = async () => {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken')?.value
        const refreshToken = cookieStore.get('refreshToken')?.value

        const cookieString = [
            accessToken ? `accessToken=${accessToken}` : '',
            refreshToken ? `refreshToken=${refreshToken}` : ''
        ].filter(Boolean).join('; ')

        const response = await plansInstances.get('/active-plans', {
            headers: {
                "Authorization": accessToken ? `Bearer ${accessToken}` : '',
                "Cookie": cookieString
            }
        })

        return response.data.plans

    } catch (err) {
        console.log(err)
    }
}
