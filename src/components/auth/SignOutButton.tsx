"use client";

import { useRouter } from "next/navigation";

import { AuthPrimaryButton } from "@/components/auth/AuthPrimaryButton";
import { clearAuthSession } from "@/lib/authSession";
import { ROUTES } from "@/lib/routes";

export function SignOutButton() {
  const router = useRouter();

  const handleSignOut = () => {
    clearAuthSession();
    router.push(ROUTES.login);
    router.refresh();
  };

  return (
    <AuthPrimaryButton type="button" className="w-auto px-4 py-2 text-sm" onClick={handleSignOut}>
      Sign Out
    </AuthPrimaryButton>
  );
}
