"use client";

import { SignOutButton } from "@/components/auth/SignOutButton";
import { useAuthStore } from "@/store/useAuthStore";

function formatRoleLabel(role: string | undefined) {
  if (!role) {
    return "Unknown";
  }

  return role
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function DashboardOverview() {
  const user = useAuthStore((state) => state.user);

  return (
    <section className="mx-auto max-w-3xl rounded-4xl border border-zinc-200/80 bg-white p-8 shadow-soft sm:p-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-secondary">
            GrandCure Dashboard
          </p>
          <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
            Welcome back
          </h1>
        </div>
        <SignOutButton />
      </div>

      <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
        <p className="text-sm font-semibold text-zinc-700">Authenticated User</p>
        <p className="mt-2 text-sm text-secondary">
          Email: <span className="font-medium text-zinc-900">{user?.email ?? "Unknown"}</span>
        </p>
        <p className="mt-1 text-sm text-secondary">
          Role: <span className="font-medium text-zinc-900">{formatRoleLabel(user?.role)}</span>
        </p>
      </div>
    </section>
  );
}
