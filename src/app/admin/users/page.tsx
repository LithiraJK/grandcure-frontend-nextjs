"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { AdminShell } from "@/components/dashboard/admin/AdminShell";
import { ROUTES } from "@/lib/routes";
import { type AdminUser, useAdminStore } from "@/store/useAdminStore";
import { useAuthStore } from "@/store/useAuthStore";

function isAdminRole(role: string | undefined) {
  return (role ?? "").toUpperCase() === "ADMIN";
}

function formatRole(role: string) {
  return role
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getInitials(name: string) {
  const tokens = name.trim().split(/\s+/).filter(Boolean);

  if (!tokens.length) {
    return "GC";
  }

  if (tokens.length === 1) {
    return tokens[0].slice(0, 2).toUpperCase();
  }

  return `${tokens[0][0] ?? ""}${tokens[1][0] ?? ""}`.toUpperCase();
}

export default function AdminUsersPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const role = useAuthStore((state) => state.user?.role);
  const users = useAdminStore((state) => state.users);
  const isLoading = useAdminStore((state) => state.isLoading);
  const fetchAllUsers = useAdminStore((state) => state.fetchAllUsers);
  const toggleVerify = useAdminStore((state) => state.toggleVerify);
  const toggleBlock = useAdminStore((state) => state.toggleBlock);

  const [actionUserId, setActionUserId] = useState<string | null>(null);
  const [tableError, setTableError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !isAdminRole(role)) {
      router.replace(ROUTES.login);
      return;
    }

    void fetchAllUsers();
  }, [fetchAllUsers, isAuthenticated, role, router]);

  const hasRows = users.length > 0;

  const verifiedCount = useMemo(() => users.filter((user) => user.isVerified).length, [users]);
  const blockedCount = useMemo(() => users.filter((user) => user.isBlocked).length, [users]);

  const handleToggleVerify = async (user: AdminUser) => {
    setTableError(null);
    setActionUserId(user.id);

    try {
      await toggleVerify(user.id);
    } catch {
      setTableError("Unable to update verification status right now.");
    } finally {
      setActionUserId(null);
    }
  };

  const handleToggleBlock = async (user: AdminUser) => {
    setTableError(null);
    setActionUserId(user.id);

    try {
      await toggleBlock(user.id);
    } catch {
      setTableError("Unable to update account block status right now.");
    } finally {
      setActionUserId(null);
    }
  };

  if (!isAuthenticated || !isAdminRole(role)) {
    return null;
  }

  return (
    <AdminShell
      activeItem="users"
      title="User Management"
      subtitle="Verify, block, and monitor user accounts across patients and caregivers."
    >
      <section className="rounded-3xl bg-surface-container-lowest p-8 shadow-soft">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-zinc-900">
              Platform Users
            </h2>
            <p className="mt-1 text-sm text-secondary">
              Editorial roster for account verification and moderation actions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className="rounded-full bg-[#eaf4fb] px-3 py-1 text-primary">
              Total: {users.length}
            </span>
            <span className="rounded-full bg-tertiary/10 px-3 py-1 text-tertiary">
              Verified: {verifiedCount}
            </span>
            <span className="rounded-full bg-zinc-200 px-3 py-1 text-zinc-700">
              Blocked: {blockedCount}
            </span>
          </div>
        </div>

        {tableError ? (
          <div className="mb-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {tableError}
          </div>
        ) : null}

        {isLoading ? (
          <div className="rounded-3xl bg-white p-6 text-sm text-secondary shadow-sm">
            Loading user records...
          </div>
        ) : !hasRows ? (
          <div className="rounded-3xl bg-white p-6 text-sm text-secondary shadow-sm">
            No users found.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-3xl bg-white p-4 shadow-sm sm:p-6">
            <table className="w-full min-w-220 border-collapse">
              <thead>
                <tr className="text-left">
                  <th className="px-3 py-3 text-xs font-black uppercase tracking-widest text-secondary">Name</th>
                  <th className="px-3 py-3 text-xs font-black uppercase tracking-widest text-secondary">Email</th>
                  <th className="px-3 py-3 text-xs font-black uppercase tracking-widest text-secondary">Role</th>
                  <th className="px-3 py-3 text-xs font-black uppercase tracking-widest text-secondary">Status</th>
                  <th className="px-3 py-3 text-xs font-black uppercase tracking-widest text-secondary">Account</th>
                  <th className="px-3 py-3 text-xs font-black uppercase tracking-widest text-secondary">Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => {
                  const isBusy = actionUserId === user.id;

                  return (
                    <tr key={user.id} className="text-sm text-zinc-800">
                      <td className="px-3 py-4">
                        <div className="flex items-center gap-3">
                          <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#dff0fb] text-xs font-black text-primary">
                            {getInitials(user.name)}
                          </div>
                          <span className="font-semibold text-zinc-900">{user.name}</span>
                        </div>
                      </td>

                      <td className="px-3 py-4 text-secondary">{user.email || "-"}</td>

                      <td className="px-3 py-4">
                        <span className="inline-flex rounded-full bg-[#edf4fa] px-2.5 py-1 text-[11px] font-bold text-primary">
                          {formatRole(user.role)}
                        </span>
                      </td>

                      <td className="px-3 py-4">
                        <span
                          className={[
                            "inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold",
                            user.isVerified
                              ? "bg-tertiary/10 text-tertiary"
                              : "bg-amber-100 text-amber-700",
                          ].join(" ")}
                        >
                          {user.isVerified ? "Verified" : "Pending"}
                        </span>
                      </td>

                      <td className="px-3 py-4">
                        <span
                          className={[
                            "inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold",
                            user.isBlocked
                              ? "bg-zinc-200 text-zinc-700"
                              : "bg-[#dff5f8] text-[#0f5b73]",
                          ].join(" ")}
                        >
                          {user.isBlocked ? "Blocked" : "Active"}
                        </span>
                      </td>

                      <td className="px-3 py-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => {
                              void handleToggleVerify(user);
                            }}
                            className={[
                              "inline-flex h-8 items-center rounded-full px-3 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
                              user.isVerified
                                ? "border border-[#b8d6e6] bg-[#eef6fc] text-[#0f5b73] hover:bg-[#e3f0fa]"
                                : "border border-tertiary/40 bg-white text-tertiary hover:bg-tertiary/10",
                            ].join(" ")}
                          >
                            {user.isVerified ? "Unverify" : "Verify"}
                          </button>

                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => {
                              void handleToggleBlock(user);
                            }}
                            className={[
                              "inline-flex h-8 items-center rounded-full px-3 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
                              user.isBlocked
                                ? "border border-zinc-300 bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                                : "border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100",
                            ].join(" ")}
                          >
                            {user.isBlocked ? "Unblock" : "Block"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </AdminShell>
  );
}
