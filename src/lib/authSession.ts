import { ROUTES } from "@/lib/routes";

export const AUTH_SESSION_COOKIE = "gc_session";
export const AUTH_ROLE_COOKIE = "gc_role";

export type AuthRole = "member" | "patient" | "caregiver";

export async function establishAuthSession(role: AuthRole, rememberDevice = false) {
  const response = await fetch(ROUTES.apiAuthSession, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ role, rememberDevice }),
  });

  if (!response.ok) {
    throw new Error("Failed to establish auth session.");
  }
}

export async function clearAuthSession() {
  const response = await fetch(ROUTES.apiAuthSession, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to clear auth session.");
  }
}
