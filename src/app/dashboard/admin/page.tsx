"use client";

import axios from "axios";
import { LayoutDashboard, Star, UsersRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { AdminStats } from "@/components/dashboard/admin/AdminStats";
import {
  AssignmentsTable,
  type AdminAssignment,
} from "@/components/dashboard/admin/AssignmentsTable";
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !isAdminRole(role)) {
      router.replace(ROUTES.login);
      return;
    }

    let isMounted = true;

    const fetchAdminData = async () => {
      setIsLoading(true);

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
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
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
    <main className="h-screen overflow-hidden bg-neutral">
      <div className="flex h-full w-full flex-col lg:flex-row">
        <aside className="flex w-full shrink-0 flex-col border-b border-zinc-200/80 bg-white px-4 py-4 sm:px-5 lg:h-full lg:w-64 lg:border-b-0 lg:border-r lg:py-6">
          <div className="space-y-1">
            <p className="text-sm font-bold text-primary">Admin Panel</p>
            <p className="text-xs text-secondary">GrandCure Management</p>
          </div>

          <nav className="mt-6 space-y-1.5" aria-label="Admin navigation">
            <a
              href="#dashboard-overview"
              className="flex h-11 items-center gap-3 rounded-2xl bg-[#edf4fa] px-3 text-sm font-semibold text-primary"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </a>
            <a
              href="#user-management"
              className="flex h-11 items-center gap-3 rounded-2xl px-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-900"
            >
              <UsersRound className="h-4 w-4" />
              Users
            </a>
            <a
              href="#reviews"
              className="flex h-11 items-center gap-3 rounded-2xl px-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-900"
            >
              <Star className="h-4 w-4" />
              Reviews
            </a>
          </nav>
        </aside>

        <section className="min-h-0 min-w-0 flex-1 overflow-hidden p-2 sm:p-4 lg:p-6">
          <div className="h-full overflow-y-auto rounded-2xl border border-zinc-200/70 bg-neutral shadow-sm sm:rounded-3xl">
            <section className="mx-auto max-w-7xl space-y-6 px-3 py-4 sm:px-6 sm:py-6">
              <header id="dashboard-overview" className="rounded-3xl border border-[#d8e4ee] bg-white p-6 shadow-soft sm:p-7">
                <p className="text-xs font-black uppercase tracking-[0.12em] text-primary">GrandCure Admin</p>
                <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
                  System Administration
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-secondary">
                  Monitor platform health, verify account eligibility, and manage care operations in one
                  centralized control center.
                </p>
              </header>

              <AdminStats stats={stats} />

              <section id="user-management" className="space-y-3 scroll-mt-6">
                <h2 className="font-display text-2xl font-extrabold tracking-tight text-zinc-900">
                  User Management
                </h2>
                {isLoading ? (
                  <div className="rounded-3xl border border-[#d8e4ee] bg-white p-6 text-sm text-secondary shadow-soft">
                    Loading user records...
                  </div>
                ) : (
                  <UserManagementTable users={users} />
                )}
              </section>

              <section id="reviews" className="space-y-3 scroll-mt-6">
                <h2 className="font-display text-2xl font-extrabold tracking-tight text-zinc-900">
                  Reviews
                </h2>
                {isLoading ? (
                  <div className="rounded-3xl border border-[#d8e4ee] bg-white p-6 text-sm text-secondary shadow-soft">
                    Loading assignment activity...
                  </div>
                ) : (
                  <AssignmentsTable assignments={assignments} />
                )}
              </section>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
