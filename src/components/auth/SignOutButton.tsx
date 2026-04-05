"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { AuthPrimaryButton } from "@/components/auth/AuthPrimaryButton";
import { clearAuthSession } from "@/lib/authSession";
import { ROUTES } from "@/lib/routes";
import { useAuthStore } from "@/store/useAuthStore";

export function SignOutButton() {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const logout = useAuthStore((state) => state.logout);

  const handleSignOut = async () => {
    setIsSigningOut(true);

    try {
      await clearAuthSession();
      logout();
      router.push(ROUTES.login);
      router.refresh();
      return;
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <AuthPrimaryButton
      type="button"
      className="w-auto px-4 py-2 text-sm"
      onClick={handleSignOut}
      disabled={isSigningOut}
      aria-busy={isSigningOut}
    >
      {isSigningOut ? "Signing Out..." : "Sign Out"}
    </AuthPrimaryButton>
  );
}
