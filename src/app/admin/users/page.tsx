"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { AdminShell } from "@/components/dashboard/admin/AdminShell";
import {
  type AdminUser,
  UserManagementTable,
} from "@/components/dashboard/admin/UserManagementTable";
import { ROUTES } from "@/lib/routes";
import { useAuthStore } from "@/store/useAuthStore";

function isAdminRole(role: string | undefined) {
  return (role ?? "").toUpperCase() === "ADMIN";
}

function parseUsersPayload(payload: unknown): AdminUser[] {
  if (Array.isArray(payload)) {
    return payload as AdminUser[];
  }

  if (
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    Array.isArray((payload as { data?: unknown }).data)
  ) {
    return (payload as { data: AdminUser[] }).data;
  }

  return [];
}

export default function AdminUsersPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const role = useAuthStore((state) => state.user?.role);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !isAdminRole(role)) {
      router.replace(ROUTES.login);
      return;
    }

    let isMounted = true;

    const fetchUsers = async () => {
      setIsLoading(true);

      try {
        const response = await axios.get("/api/backend/admin/users");
        if (isMounted) {
          setUsers(parseUsersPayload(response.data));
        }
      } catch {
        if (isMounted) {
          setUsers([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void fetchUsers();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, role, router]);

  if (!isAuthenticated || !isAdminRole(role)) {
    return null;
  }

  return (
    <AdminShell
      activeItem="users"
      title="User Management"
      subtitle="Verify, block, and monitor user accounts across patients and caregivers."
    >
      {isLoading ? (
        <div className="rounded-3xl border border-[#d8e4ee] bg-white p-6 text-sm text-secondary shadow-soft">
          Loading user records...
        </div>
      ) : (
        <UserManagementTable users={users} />
      )}
    </AdminShell>
  );
}
