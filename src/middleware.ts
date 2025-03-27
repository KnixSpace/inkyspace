import { type NextRequest, NextResponse } from "next/server";
import { apiRequest } from "./lib/apis/api";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieSession = request.cookies.get("connect.sid");
  const publicRoutes = ["/", "/auth/login", "/auth/register", "/auth/verify"];

  if (pathname === "/explore") {
    return NextResponse.next();
  }

  if (pathname === "/auth" || pathname === "/auth/verify") {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (cookieSession) {
    try {
      const response = await apiRequest("/auth/verify", "GET", null, {
        Cookie: `connect.sid=${cookieSession.value}`,
      });

      if (
        response.success &&
        (publicRoutes.includes(pathname) ||
          pathname.match(/\/auth\/verify\/([a-zA-Z0-9._-]+)/))
      ) {
        return NextResponse.redirect(new URL("/explore", request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  } else if (!cookieSession) {
    if (pathname.match(/\/auth\/verify\/([a-zA-Z0-9._-]+)/)) {
      return NextResponse.next();
    }
    if (!publicRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/auth/:path*", "/explore"],
};
