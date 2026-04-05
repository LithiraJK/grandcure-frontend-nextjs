import { NextResponse, type NextRequest } from "next/server";

const AUTH_SESSION_COOKIE = "gc_session";

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const hasSession = Boolean(request.cookies.get(AUTH_SESSION_COOKIE)?.value);

	const isPortalPath = pathname.startsWith("/portal");
	const isAuthPath = pathname === "/login" || pathname.startsWith("/register");

	if (isPortalPath && !hasSession) {
		const loginUrl = new URL("/login", request.url);
		return NextResponse.redirect(loginUrl);
	}

	if (isAuthPath && hasSession) {
		const portalUrl = new URL("/portal", request.url);
		return NextResponse.redirect(portalUrl);
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/portal/:path*", "/login", "/register/:path*"],
};
