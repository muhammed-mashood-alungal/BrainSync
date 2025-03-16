import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { AuthServices } from "./services/client/auth.client"
import { JwtPayload } from 'jsonwebtoken'
const adminRoutes = ["/admin", "/admin/dashboard", "/admin/users"]
const protectedRoutes = ["/dashboard", "/profile", "/settings"]

export async function middleware(req: NextRequest) {
    try {
        const token = req.cookies.get("accessToken")?.value
        const refreshToken = req.cookies.get("refreshToken")?.value
        const isAdminRoute = adminRoutes.some((route) => req.nextUrl.pathname.startsWith(route))
        const isProtectedRoute = protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))
   
        if (!token && req.nextUrl.pathname === "/admin/login") {
            return NextResponse.next()
        }


        if (!token && isProtectedRoute) {
            return NextResponse.redirect(new URL("/login", req.url))
        }
        let user = await AuthServices.verifyToken(token as string) as JwtPayload
        if(!user){
            user = await AuthServices.refreshToken(refreshToken as string) as JwtPayload
        }
        console.log(user)

        if (isAdminRoute && (!user || user.role !== "admin")) {
            return NextResponse.redirect(new URL("/", req.url))
        }  

        if (isProtectedRoute && !user) {
            return NextResponse.redirect(new URL("/login", req.url))
        } 

        return NextResponse.next()
    } catch (err : unknown) {
        console.log(err)
        if(err instanceof Error){
            console.log(err.message)
        }
       
    }

}

export const config = {
    matcher: ["/admin/:path*", "/dashboard/:path*", "/profile", "/settings"],
}