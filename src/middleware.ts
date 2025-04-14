import { type NextRequest, NextResponse } from "next/server";
import { apiRequest } from "./lib/apis/api";

const publicRoutes = [
  "/",
  "/auth/login",
  "/auth/register",
  "/auth/team-invite",
  "/auth/verify",
];

const settingsRotes = {
  O: [
    "/settings/profile",
    "/settings/editor-management",
    "/settings/space-management",
    "/settings/threads",
    "/settings/thread-approvals",
    "/settings/security",
  ],
  U: ["/settings/profile", "/settings/subscribed-spaces", "/settings/security"],
  E: [
    "/settings/profile",
    "/settings/owner-info",
    "/settings/threads",
    "/settings/thread-approvals",
    "/settings/security",
  ],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieSession = request.cookies.get("connect.sid");

  if (pathname === "/explore" || pathname.match(/\/(profile|space)\/(.*)/)) {
    return NextResponse.next();
  }

  if (pathname === "/auth" || pathname === "/auth/verify") {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (pathname === "/space" || pathname === "/profile") {
    return NextResponse.redirect(new URL("/explore", request.url));
  }

  if (cookieSession) {
    try {
      const response = await apiRequest<{
        isLoggedIn: boolean;
        role: "U" | "O" | "A" | "E";
      }>("/auth/verify", "GET", null, {
        Cookie: `connect.sid=${cookieSession.value}`,
      });

      if (response.data?.isLoggedIn) {
        if (
          publicRoutes.includes(pathname) ||
          pathname.match(/\/auth\/(verify|team-invite)\/([a-zA-Z0-9._-]+)/)
        ) {
          return NextResponse.redirect(new URL("/explore", request.url));
        }

        if (pathname.match(/\/settings\/(.*)/)) {
          const userRole = response.data.role;
          const settingsRoutes =
            settingsRotes[userRole as keyof typeof settingsRotes];

          if (!settingsRoutes?.includes(pathname)) {
            return NextResponse.redirect(
              new URL("/settings/profile", request.url)
            );
          }
        }
      }

      if (!response.data?.isLoggedIn) {
        if (
          publicRoutes.includes(pathname) ||
          pathname.match(/\/auth\/(verify|team-invite)\/([a-zA-Z0-9._-]+)/)
        ) {
          return NextResponse.next();
        }
      }
    } catch (error) {
      console.error("Session verification failed:", error);
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  } else {
    if (
      !pathname.match(/\/auth\/(verify|team-invite)\/([a-zA-Z0-9._-]+)/) &&
      !publicRoutes.includes(pathname)
    ) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  if (pathname === "/settings") {
    return NextResponse.redirect(new URL("/settings/profile", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/auth/:path*",
    "/explore",
    "/settings/:path*",
    "/space/:path",
    "/profile/:path",
  ],
};
