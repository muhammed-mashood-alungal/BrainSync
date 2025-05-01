import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { AuthServices } from "./services/client/auth.client"
import { JwtPayload } from 'jsonwebtoken'
import { NextApiResponse } from "next"
const adminRoutes = ["/admin", "/admin/dashboard", "/admin/users"]
const protectedRoutes = ["/dashboard", "/profile", "/settings"]

export async function middleware(req: NextRequest ,  res:NextApiResponse ) {
    try {
        const token = req.cookies.get("accessToken")?.value
        const refreshToken = req.cookies.get("refreshToken")?.value
        const isAdminRoute = adminRoutes.some((route) => req.nextUrl.pathname.startsWith(route))
        const isProtectedRoute = protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))
      console.log('token is : ',token)
      console.log('refresh token : ',refreshToken)
      console.log(isAdminRoute)
      console.log(isProtectedRoute)
      
        if (!token && req.nextUrl.pathname === "/admin/login") {
            console.log('no token 1')
            return NextResponse.next()
        }


        if (!token && isProtectedRoute) {
            console.log('no token and protected router')
            return NextResponse.redirect(new URL("/login", req.url))
        }
        let user = await AuthServices.verifyToken(token as string) as JwtPayload
        console.log(user)
        if(!user){
            user = await AuthServices.refreshToken(refreshToken as string) as JwtPayload
        }
        
        if (isAdminRoute && (!user || user.role !== "admin")) {
            console.log('admin route and no entry')
            return NextResponse.redirect(new URL("/", req.url))
        }  


        if (isProtectedRoute && !user) {
            console.log('protected bu tno login!!!')
            return NextResponse.redirect(new URL("/login", req.url))
        } 
        return NextResponse.next()
    } catch (err : unknown) {
        if(err instanceof Error){
            console.log(err.message)
        }
       
    }

}

export const config = {
    matcher: ["/admin/:path*", "/dashboard/:path*", "/profile", "/settings"],
}