"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { AdminShell } from "@/components/dashboard/admin/AdminShell";
import { AdminStats } from "@/components/dashboard/admin/AdminStats";
import { type AdminAssignment } from "@/components/dashboard/admin/AssignmentsTable";
import { type AdminUser } from "@/components/dashboard/admin/UserManagementTable";
import { ROUTES } from "@/lib/routes";
import { useAuthStore } from "@/store/useAuthStore";

function isAdminRole(role: string | undefined) {
  return (role ?? "").toUpperCase() === "ADMIN";
}

function resolveRoleRedirect(role: string | undefined) {
  const normalized = (role ?? "").toUpperCase();

  if (normalized === "CARE_GIVER" || normalized === "CAREGIVER") {
    return ROUTES.caregiver;
  }

  if (normalized === "PATIENT") {
    return ROUTES.patient;
  }

  return ROUTES.forbidden;
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

function parseAssignmentsPayload(payload: unknown): AdminAssignment[] {
  if (Array.isArray(payload)) {
    return payload as AdminAssignment[];
  }

  if (
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    Array.isArray((payload as { data?: unknown }).data)
  ) {
    return (payload as { data: AdminAssignment[] }).data;
  }

  return [];
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const role = useAuthStore((state) => state.user?.role);

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [assignments, setAssignments] = useState<AdminAssignment[]>([]);
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(ROUTES.login);
      return;
    }

    if (!isAdminRole(role)) {
      router.replace(resolveRoleRedirect(role));
      return;
    }

    let isMounted = true;

    const fetchAdminData = async () => {
      try {
        const [usersResponse, assignmentsResponse] = await Promise.all([
          axios.get("/api/backend/admin/users"),
          axios.get("/api/backend/admin/assignments"),
        ]);

        if (!isMounted) {
          return;
        }

        setUsers(parseUsersPayload(usersResponse.data));
        setAssignments(parseAssignmentsPayload(assignmentsResponse.data));
      } catch {
        if (!isMounted) {
          return;
        }

        setUsers([]);
        setAssignments([]);
      }
    };

    void fetchAdminData();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, role, router]);

  const stats = useMemo(() => {
    const pendingVerifications = users.filter((user) => !user.isVerified).length;
    const activeAssignments = assignments.filter((assignment) => {
      const status = assignment.status.toUpperCase();
      return status === "PENDING" || status === "ACCEPTED";
    }).length;

    return {
      totalUsers: users.length,
      pendingVerifications,
      activeAssignments,
    };
  }, [assignments, users]);

  if (!isAuthenticated || !isAdminRole(role)) {
    return (
      <main className="min-h-screen bg-neutral px-4 py-8 sm:px-6 lg:px-8">
        <section className="mx-auto max-w-7xl rounded-3xl border border-zinc-200 bg-white p-6 shadow-soft">
          <p className="text-sm font-medium text-secondary">Redirecting to login...</p>
        </section>
      </main>
    );
  }

  return (
    <AdminShell
      activeItem="dashboard"
      title="System Administration"
      subtitle="Monitor platform health, verify account eligibility, and manage care operations in one centralized control center."
    >
      <AdminStats stats={stats} />

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Link
          href={ROUTES.adminUsers}
          className="rounded-3xl border border-[#d8e4ee] bg-white p-6 shadow-soft transition hover:border-primary/25 hover:shadow-md"
        >
          <p className="text-xs font-black uppercase tracking-[0.12em] text-primary">Users</p>
          <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-zinc-900">
            User Management
          </h2>
          <p className="mt-2 text-sm text-secondary">
            Open account verification and moderation tools for patients and caregivers.
          </p>
        </Link>

        <Link
          href={ROUTES.adminAssignments}
          className="rounded-3xl border border-[#d8e4ee] bg-white p-6 shadow-soft transition hover:border-primary/25 hover:shadow-md"
        >
          <p className="text-xs font-black uppercase tracking-[0.12em] text-primary">Assignments</p>
          <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-zinc-900">
            Platform Assignments Oversight
          </h2>
          <p className="mt-2 text-sm text-secondary">
            Inspect care request workflows and lifecycle activity from one feed.
          </p>
        </Link>
      </section>
    </AdminShell>
  );
}
