import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const protectedRoutes = ["/admin", "/admin/dashboard", "/admin/users"]

export function middleware(req: NextRequest) {
    const token = req.cookies.get("accessToken")?.value;
     console.log(req.url)
    if (!token && req.url == 'http://localhost:3000/admin/login') {
        return NextResponse.next()
    }else if(!token){
        return NextResponse.redirect(new URL("/", req.url))
    }

    const decoded = decodeJwt(token)

    if (!decoded || decoded.role !== "admin"){
        return NextResponse.redirect(new URL("/", req.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/admin/:path*"], 
};

function decodeJwt(token: string) {
    try {
        const payload = JSON.parse(atob(token.split(".")[1]))
        return payload
    } catch (error) {
        return null
    }
}
