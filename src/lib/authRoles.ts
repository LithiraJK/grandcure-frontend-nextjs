import type { AuthRole } from "@/lib/authSession";
import type { ApiUserRole } from "@/services/auth.service";

export type RegistrationRoleSelection = "patient" | "caregiver";

export function mapSelectionToApiRole(role: RegistrationRoleSelection): ApiUserRole {
  return role === "caregiver" ? "CARE_GIVER" : "PATIENT";
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
