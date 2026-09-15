import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secretKey = process.env.JWT_SECRET || "LPPNU-MAGELANG-SUPER-SECRET-KEY-12345";
const key = new TextEncoder().encode(secretKey);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Protect all /admin routes except /admin/login
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const sessionToken = request.cookies.get("admin_session")?.value;
    
    if (!sessionToken) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
    
    try {
      // Verify JWT token
      await jwtVerify(sessionToken, key, {
        algorithms: ["HS256"],
      });
      // Token valid, proceed
      return NextResponse.next();
    } catch (error) {
      // Token invalid or expired
      const loginUrl = new URL("/admin/login", request.url);
      // Clear invalid cookie
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete("admin_session");
      return response;
    }
  }

  // Also protect all /api/admin routes except login and logout (if needed, but usually we just let the API handle 401, but doing it in middleware is fine too)
  // For now, Next.js API Routes can also manually verify.

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
