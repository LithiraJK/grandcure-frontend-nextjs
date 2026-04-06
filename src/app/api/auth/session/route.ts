import { NextResponse, type NextRequest } from "next/server";

import { AUTH_ROLE_COOKIE, AUTH_SESSION_COOKIE, type AuthRole } from "@/lib/authSession";

/**
 * Auth Session API Route
 
 * - POST: Create a new auth session (login)
 * - DELETE: Clear the auth session (logout)
 * - Uses secure, HTTP-only cookies to manage session state.
 * - Validates input and handles errors gracefully.
 * - Designed to work with the frontend auth store and session guard for seamless authentication flow.
 
 */

const THIRTY_DAYS_IN_SECONDS = 30 * 24 * 60 * 60;

function isAuthRole(value: unknown): value is AuthRole {
  return value === "member" || value === "patient" || value === "caregiver";
}

function getCookieOptions(maxAge?: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    ...(maxAge ? { maxAge } : {}),
  };
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as
    | {
        role?: unknown;
        rememberDevice?: unknown;
      }
    | null;

  if (!body || !isAuthRole(body.role)) {
    return NextResponse.json({ error: "Invalid role." }, { status: 400 });
  }

  const rememberDevice = body.rememberDevice === true;
  const maxAge = rememberDevice ? THIRTY_DAYS_IN_SECONDS : undefined;

  const response = NextResponse.json({ ok: true });
  response.cookies.set(AUTH_SESSION_COOKIE, "active", getCookieOptions(maxAge));
  response.cookies.set(AUTH_ROLE_COOKIE, body.role, getCookieOptions(maxAge));

  return response;
}

export function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(AUTH_SESSION_COOKIE, "", getCookieOptions(0));
  response.cookies.set(AUTH_ROLE_COOKIE, "", getCookieOptions(0));
  return response;
}
