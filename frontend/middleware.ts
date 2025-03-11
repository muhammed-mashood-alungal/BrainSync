// import { NextResponse } from "next/server"
// import type { NextRequest } from "next/server"

// const protectedRoutes = ["/admin", "/admin/dashboard", "/admin/users"]

// export function middleware(req: NextRequest) {
//     const token = req.cookies.get("accessToken")?.value;
//      console.log(req.url)
//     if (!token && req.url == 'http://localhost:3000/admin/login') {
//         return NextResponse.next()
//     }else if(!token){
//         return NextResponse.redirect(new URL("/", req.url))
//     }

//     const decoded = decodeJwt(token)

//     if (!decoded || decoded.role !== "admin"){
//         return NextResponse.redirect(new URL("/", req.url))
//     }

//     return NextResponse.next()
// }

// export const config = {
//     matcher: ["/admin/:path*"], 
// };

// function decodeJwt(token: string) {
//     try {
//         const payload = JSON.parse(atob(token.split(".")[1]))
//         return payload
//     } catch (error) {
//         return null
//     }
// }


import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const adminRoutes = ["/admin", "/admin/dashboard", "/admin/users"];
const protectedRoutes = ["/dashboard", "/profile", "/settings"]; // Add more protected routes as needed

export function middleware(req: NextRequest) {
    const token = req.cookies.get("accessToken")?.value;
    const isAdminRoute = adminRoutes.some((route) => req.nextUrl.pathname.startsWith(route));
    const isProtectedRoute = protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route));

    console.log(req.url);

    // Allow access to admin login page without token
    if (!token && req.nextUrl.pathname === "/admin/login") {
        return NextResponse.next();
    }

    // Redirect non-logged-in users trying to access protected pages
    if (!token && isProtectedRoute) {
        return NextResponse.redirect(new URL("/login", req.url)); // Redirect to login page
    }

    const decoded = decodeJwt(token as string);

    // Protect admin pages (only allow admins)
    if (isAdminRoute && (!decoded || decoded.role !== "admin")) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    // Allow access to protected user routes for logged-in users
    if (isProtectedRoute && !decoded) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/dashboard/:path*", "/profile", "/settings"], // Protect multiple paths
};

function decodeJwt(token: string) {
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload;
    } catch (error) {
        return null;
    }
}
