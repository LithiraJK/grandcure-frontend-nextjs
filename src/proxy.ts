import { NextResponse, type NextRequest } from "next/server";

/* This middleware:

- Protects dashboard
- Prevents logged‑in users from seeing login/register
- Uses a session cookie to check login state
- Redirects users correctly

**/

const AUTH_SESSION_COOKIE = "gc_session";
const AUTH_ROLE_COOKIE = "gc_role";

type SessionRole = "member" | "patient" | "caregiver";

function resolveRoleHome(role: SessionRole | null) {
  if (role === "caregiver") {
    return "/caregiver";
  }

  if (role === "member") {
    return "/admin";
  }

  return "/patient";
}

function getRequestedRole(pathname: string): SessionRole | null {
  if (pathname === "/dashboard/admin" || pathname.startsWith("/dashboard/admin/")) {
    return "member";
  }

  if (pathname === "/dashboard/caregiver" || pathname.startsWith("/dashboard/caregiver/")) {
    return "caregiver";
  }

  if (pathname === "/dashboard/patient" || pathname.startsWith("/dashboard/patient/")) {
    return "patient";
  }

  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    return "patient";
  }

  if (pathname.startsWith("/admin")) {
    return "member";
  }

  if (pathname.startsWith("/patient")) {
    return "patient";
  }

  if (pathname.startsWith("/caregiver")) {
    return "caregiver";
  }

  return null;
}

function isRole(value: string | undefined): value is SessionRole {
  return value === "member" || value === "patient" || value === "caregiver";
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = Boolean(request.cookies.get(AUTH_SESSION_COOKIE)?.value);
  const roleCookieValue = request.cookies.get(AUTH_ROLE_COOKIE)?.value;
  const sessionRole = isRole(roleCookieValue) ? roleCookieValue : null;

  const isDashboardPath = pathname === "/dashboard" || pathname.startsWith("/dashboard/");
  const isRolePath =
    pathname.startsWith("/admin") || pathname.startsWith("/patient") || pathname.startsWith("/caregiver");
  const isAuthPath = pathname === "/login" || pathname.startsWith("/register");

  if ((isDashboardPath || isRolePath) && !hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("session", "missing");
    return NextResponse.redirect(loginUrl);
  }

  if ((isDashboardPath || isRolePath) && hasSession) {
    const requiredRole = getRequestedRole(pathname);

    if (!requiredRole || !sessionRole) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("session", "missing");
      return NextResponse.redirect(loginUrl);
    }

    if (requiredRole !== sessionRole) {
      return NextResponse.rewrite(new URL("/403", request.url));
    }
  }

  if (isAuthPath && hasSession) {
    const roleHomeUrl = new URL(resolveRoleHome(sessionRole), request.url);
    return NextResponse.redirect(roleHomeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/patient/:path*",
    "/caregiver/:path*",
    "/login",
    "/register/:path*",
  ],
};
