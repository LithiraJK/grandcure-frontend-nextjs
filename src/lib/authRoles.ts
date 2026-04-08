import type { AuthRole } from "@/lib/authSession";
import type { ApiUserRole } from "@/services/auth.service";

export type RegistrationRoleSelection = "patient" | "caregiver";

export function mapSelectionToApiRole(role: RegistrationRoleSelection): ApiUserRole {
  return role === "caregiver" ? "CARE_GIVER" : "PATIENT";
}

function sanitizeRoleToken(value: string) {
  return value
    .trim()
    .toUpperCase()
    .replace(/^ROLE[_\s-]*/, "")
    .replace(/[\s-]+/g, "_");
}

export function resolveJwtRole(payload: Record<string, unknown>): string | undefined {
  const directCandidates = [
    payload.role,
    payload.userRole,
    payload.user_role,
    payload.primaryRole,
  ];

  for (const candidate of directCandidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      return sanitizeRoleToken(candidate);
    }
  }

  const arrayCandidates = [payload.roles, payload.authorities];

  for (const candidate of arrayCandidates) {
    if (Array.isArray(candidate)) {
      const firstString = candidate.find((value) => typeof value === "string" && value.trim());

      if (typeof firstString === "string") {
        return sanitizeRoleToken(firstString);
      }
    }
  }

  const scopeCandidate = typeof payload.scope === "string"
    ? payload.scope
    : typeof payload.scp === "string"
      ? payload.scp
      : "";

  if (scopeCandidate) {
    const tokens = scopeCandidate
      .split(/[\s,]+/)
      .map((value) => sanitizeRoleToken(value))
      .filter(Boolean);

    const matched = tokens.find((token) =>
      token === "CARE_GIVER" || token === "CAREGIVER" || token === "PATIENT" || token === "ADMIN" || token === "MEMBER",
    );

    if (matched) {
      return matched;
    }
  }

  return undefined;
}

export function mapJwtRoleToSessionRole(role: string | undefined): AuthRole {
  if (!role) {
    return "member";
  }

  const normalized = role.toUpperCase();

  if (normalized === "PATIENT") {
    return "patient";
  }

  if (normalized === "CARE_GIVER" || normalized === "CAREGIVER") {
    return "caregiver";
  }

  return "member";
}
