import { NextResponse, type NextRequest } from "next/server";

const AUTH_SESSION_COOKIE = "gc_session";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = Boolean(request.cookies.get(AUTH_SESSION_COOKIE)?.value);

  const isDashboardPath = pathname.startsWith("/dashboard");
  const isAuthPath = pathname === "/login" || pathname.startsWith("/register");

  if (isDashboardPath && !hasSession) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPath && hasSession) {
    const dashboardUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register/:path*"],
};
