export const AUTH_SESSION_COOKIE = "gc_session";
export const AUTH_ROLE_COOKIE = "gc_role";

type AuthRole = "member" | "patient" | "caregiver";

export function establishAuthSession(role: AuthRole, rememberDevice = false) {
  if (typeof document === "undefined") {
    return;
  }

  const maxAgePart = rememberDevice ? "; max-age=2592000" : "";
  const common = "; path=/; samesite=lax";

  document.cookie = `${AUTH_SESSION_COOKIE}=active${maxAgePart}${common}`;
  document.cookie = `${AUTH_ROLE_COOKIE}=${role}${maxAgePart}${common}`;
}

export function clearAuthSession() {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${AUTH_SESSION_COOKIE}=; max-age=0; path=/; samesite=lax`;
  document.cookie = `${AUTH_ROLE_COOKIE}=; max-age=0; path=/; samesite=lax`;
}
