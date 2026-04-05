"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { clearAuthSession } from "@/lib/authSession";
import { ROUTES } from "@/lib/routes";
import { useAuthStore } from "@/store/useAuthStore";

type AuthSessionGuardProps = {
  children: ReactNode;
};

const CHECK_INTERVAL_MS = 30_000;

function isExpired(exp: number | undefined) {
  if (!exp) {
    return true;
  }

  return exp <= Math.floor(Date.now() / 1000);
}

export function AuthSessionGuard({ children }: AuthSessionGuardProps) {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [isReady, setIsReady] = useState(false);
  const isRedirectingRef = useRef(false);

  useEffect(() => {
    const enforce = async () => {
      if (isRedirectingRef.current) {
        return false;
      }

      if (!token || !user) {
        isRedirectingRef.current = true;
        logout();

        try {
          await clearAuthSession();
        } catch {
          // Ignore cleanup failures and continue redirecting to login.
        }

        router.replace(`${ROUTES.login}?session=missing`);
        return false;
      }

      if (isExpired(user.exp)) {
        isRedirectingRef.current = true;
        logout();

        try {
          await clearAuthSession();
        } catch {
          // Ignore cleanup failures and continue redirecting to login.
        }

        router.replace(`${ROUTES.login}?expired=1`);
        return false;
      }

      return true;
    };

    void enforce().then((ok) => setIsReady(ok));
    const intervalId = window.setInterval(() => {
      void enforce();
    }, CHECK_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [token, user, logout, router]);

  if (!isReady) {
    return (
      <section className="mx-auto max-w-3xl rounded-4xl border border-zinc-200/80 bg-white p-8 shadow-soft sm:p-10">
        <p className="text-sm font-medium text-secondary">Validating session...</p>
      </section>
    );
  }

  return <>{children}</>;
}
