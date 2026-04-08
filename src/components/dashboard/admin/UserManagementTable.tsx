"use client";

import axios from "axios";
import { useEffect, useMemo, useState } from "react";

export type AdminUser = {
  id: string;
  name: string;
  role: "PATIENT" | "CARE_GIVER" | "ADMIN" | string;
  contact: string;
  isVerified: boolean;
  isBlocked: boolean;
};

type UserManagementTableProps = {
  users?: AdminUser[];
};

const mockUsers: AdminUser[] = [
  {
    id: "usr-101",
    name: "Sarah Mitchell",
    role: "CARE_GIVER",
    contact: "sarah.m@grandcure.care",
    isVerified: false,
    isBlocked: false,
  },
  {
    id: "usr-102",
    name: "Evelyn Davis",
    role: "PATIENT",
    contact: "evelyn.d@grandcure.care",
    isVerified: true,
    isBlocked: false,
  },
  {
    id: "usr-103",
    name: "James Cooper",
    role: "PATIENT",
    contact: "+1 (555) 900-1177",
    isVerified: true,
    isBlocked: true,
  },
];

function formatRole(role: string) {
  return role
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function UserManagementTable({ users }: UserManagementTableProps) {
  const [rows, setRows] = useState<AdminUser[]>(users && users.length > 0 ? users : mockUsers);
  const [busyUserId, setBusyUserId] = useState<string | null>(null);

  useEffect(() => {
    if (users && users.length > 0) {
      setRows(users);
    }
  }, [users]);

  const hasRows = useMemo(() => rows.length > 0, [rows.length]);

  const updateRow = (userId: string, next: Partial<AdminUser>) => {
    setRows((current) =>
      current.map((user) => (user.id === userId ? { ...user, ...next } : user)),
    );
  };

  const handleVerify = async (userId: string) => {
    setBusyUserId(userId);

    try {
      await axios.patch(`/api/backend/admin/users/${userId}/verify`);
      updateRow(userId, { isVerified: true });
    } catch {
      // Keep UI stable for MVP even if the API is unavailable.
    } finally {
      setBusyUserId(null);
    }
  };

  const handleToggleBlock = async (userId: string, isCurrentlyBlocked: boolean) => {
    setBusyUserId(userId);

    try {
      await axios.patch(`/api/backend/admin/users/${userId}/block`, {
        isBlocked: !isCurrentlyBlocked,
      });
      updateRow(userId, { isBlocked: !isCurrentlyBlocked });
    } catch {
      // Keep UI stable for MVP even if the API is unavailable.
    } finally {
      setBusyUserId(null);
    }
  };

  return (
    <section className="overflow-hidden rounded-3xl border border-[#d8e4ee] bg-white shadow-soft">
      <div className="overflow-x-auto">
        <table className="min-w-190 w-full border-separate border-spacing-0">
          <thead>
            <tr className="bg-[#f4f8fc] text-left">
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-secondary">Name</th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-secondary">Role</th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-secondary">Contact</th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-secondary">Status</th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-secondary">Account</th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-secondary">Actions</th>
            </tr>
          </thead>

          <tbody>
            {hasRows ? (
              rows.map((user) => {
                const isBusy = busyUserId === user.id;

                return (
                  <tr key={user.id} className="border-t border-zinc-100 text-sm text-zinc-800">
                    <td className="px-4 py-4 font-semibold text-zinc-900">{user.name}</td>
                    <td className="px-4 py-4">{formatRole(user.role)}</td>
                    <td className="px-4 py-4 text-secondary">{user.contact}</td>

                    <td className="px-4 py-4">
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

                    <td className="px-4 py-4">
                      <span
                        className={[
                          "inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold",
                          user.isBlocked ? "bg-red-100 text-red-700" : "bg-[#dff5f8] text-[#0f5b73]",
                        ].join(" ")}
                      >
                        {user.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex flex-wrap items-center gap-2">
                        {!user.isVerified ? (
                          <button
                            type="button"
                            onClick={() => handleVerify(user.id)}
                            disabled={isBusy}
                            className="inline-flex h-8 items-center rounded-full border border-tertiary/40 px-3 text-xs font-semibold text-tertiary transition hover:bg-tertiary/10 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            Verify
                          </button>
                        ) : null}

                        <button
                          type="button"
                          onClick={() => handleToggleBlock(user.id, user.isBlocked)}
                          disabled={isBusy}
                          className={[
                            "inline-flex h-8 items-center rounded-full border px-3 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
                            user.isBlocked
                              ? "border-zinc-400 text-zinc-700 hover:bg-zinc-100"
                              : "border-red-300 text-red-700 hover:bg-red-50",
                          ].join(" ")}
                        >
                          {user.isBlocked ? "Unblock" : "Block"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-sm text-secondary">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
