"use client";

import {
  Bell,
  CircleHelp,
  ClipboardList,
  LayoutDashboard,
  Search,
  Settings,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { ComponentType } from "react";
import { useEffect, useMemo } from "react";

import { SignOutButton } from "@/components/auth/SignOutButton";
import { EarningsWidget } from "@/components/dashboard/caregiver/EarningsWidget";
import { MapWidget } from "@/components/dashboard/caregiver/MapWidget";
import { OnCallStatus } from "@/components/dashboard/caregiver/OnCallStatus";
import { ScheduleWidget } from "@/components/dashboard/caregiver/ScheduleWidget";
import { StandardRequestCard } from "@/components/dashboard/caregiver/StandardRequestCard";
import { UrgentRequestCard } from "@/components/dashboard/caregiver/UrgentRequestCard";
import { ROUTES } from "@/lib/routes";
import { useAssignmentStore } from "@/store/useAssignmentStore";
import { useAuthStore } from "@/store/useAuthStore";

function isCaregiverRole(role: string | undefined) {
  if (!role) {
    return false;
  }

  const normalized = role.toUpperCase();
  return normalized === "CARE_GIVER" || normalized === "CAREGIVER";
}

type NavItem = {
  label: string;
  icon: ComponentType<{ className?: string }>;
  isActive?: boolean;
};

const primaryNavItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, isActive: true },
  { label: "Requests", icon: ClipboardList },
  { label: "Schedule", icon: ClipboardList },
  { label: "Profile", icon: User },
  { label: "Admin Escalation", icon: CircleHelp },
];

const secondaryNavItems: NavItem[] = [
  { label: "Settings", icon: Settings },
  { label: "Help", icon: CircleHelp },
];

export default function CaregiverDashboardPage() {
  const router = useRouter();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const userRole = useAuthStore((state) => state.user?.role);
  const userEmail = useAuthStore((state) => state.user?.email);

  const assignments = useAssignmentStore((state) => state.assignments);
  const isLoadingAssignments = useAssignmentStore((state) => state.isLoading);
  const fetchPendingRequests = useAssignmentStore((state) => state.fetchPendingRequests);

  useEffect(() => {
    if (!isAuthenticated || !isCaregiverRole(userRole)) {
      router.replace(ROUTES.login);
    }
  }, [isAuthenticated, router, userRole]);

  useEffect(() => {
    void fetchPendingRequests();
  }, [fetchPendingRequests]);

  const pendingAssignments = useMemo(
    () => assignments.filter((assignment) => assignment.status === "PENDING"),
    [assignments],
  );

  const profileInitial = useMemo(() => {
    if (!userEmail) {
      return "C";
    }

    return userEmail.charAt(0).toUpperCase();
  }, [userEmail]);

  if (!isAuthenticated || !isCaregiverRole(userRole)) {
    return (
      <main className="min-h-screen bg-neutral px-4 py-8 sm:px-6 lg:px-8">
        <section className="mx-auto max-w-6xl rounded-3xl border border-zinc-200 bg-white p-6 shadow-soft">
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
            <p className="text-sm font-bold text-primary">Caregiver Portal</p>
            <p className="text-xs text-secondary">Active Shift: 4h 20m</p>
          </div>

          <nav className="mt-6 space-y-1.5" aria-label="Primary navigation">
            {primaryNavItems.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.label}
                  type="button"
                  className={[
                    "flex h-11 w-full items-center gap-3 rounded-2xl px-3 text-left text-sm font-semibold transition",
                    item.isActive
                      ? "bg-[#edf4fa] text-primary"
                      : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900",
                  ].join(" ")}
                  aria-current={item.isActive ? "page" : undefined}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <button
            type="button"
            className="mt-auto inline-flex h-11 items-center justify-center rounded-full bg-primary px-4 text-sm font-semibold text-white shadow-soft transition hover:bg-[#004d80]"
          >
            Quick Report
          </button>

          <nav className="mt-4 space-y-1.5" aria-label="Secondary navigation">
            {secondaryNavItems.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.label}
                  type="button"
                  className="flex h-10 w-full items-center gap-3 rounded-2xl px-3 text-left text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-900"
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        <section className="min-h-0 min-w-0 flex-1 overflow-hidden p-2 sm:p-4 lg:p-6">
          <div className="h-full overflow-y-auto rounded-2xl border border-zinc-200/70 bg-neutral shadow-sm sm:rounded-3xl">
            <header className="sticky top-0 z-10 flex flex-wrap items-center gap-3 border-b border-zinc-200/70 bg-white/95 px-3 py-3 backdrop-blur sm:px-6 sm:py-4">
              <p className="font-display text-2xl font-extrabold tracking-tight text-primary">GrandCure</p>

              <label className="relative block w-full lg:max-w-xl lg:pl-4">
                <Search
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary"
                />
                <input
                  type="search"
                  placeholder="Search patients or requests..."
                  className="h-11 w-full rounded-3xl border border-transparent bg-zinc-100 pl-10 pr-4 text-sm text-zinc-800 outline-none transition placeholder:text-secondary focus:border-primary/30 focus:bg-white"
                />
              </label>

              <div className="flex w-full items-center justify-end gap-2 sm:gap-3 lg:ml-auto lg:w-auto">
                <span className="inline-flex h-8 items-center rounded-full bg-tertiary/15 px-4 text-xs font-bold tracking-[0.08em] text-tertiary">
                  ACTIVE
                </span>

                <button
                  type="button"
                  className="inline-flex h-10 items-center rounded-full bg-[#f6e8e8] px-3 text-xs font-semibold text-[#c81d25] transition hover:bg-[#f1dbdb] sm:px-4 sm:text-sm"
                >
                  Emergency Support
                </button>

                <button
                  type="button"
                  aria-label="Notifications"
                  className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-zinc-700 transition hover:bg-zinc-100"
                >
                  <Bell className="h-4 w-4" />
                  <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-500" />
                </button>

                <details className="relative">
                  <summary className="list-none">
                    <button
                      type="button"
                      aria-label="Open profile menu"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#7cd7df] bg-linear-to-br from-[#2bb4c5] to-[#1f8ca0] text-sm font-bold text-white"
                    >
                      {profileInitial}
                    </button>
                  </summary>

                  <div className="absolute right-0 top-12 z-20 w-56 rounded-2xl border border-zinc-200 bg-white p-3 shadow-soft">
                    <p className="text-xs font-semibold text-secondary">Signed in as</p>
                    <p className="mt-1 truncate text-sm font-medium text-zinc-900">
                      {userEmail ?? "caregiver@grandcure.com"}
                    </p>
                    <div className="mt-3">
                      <SignOutButton />
                    </div>
                  </div>
                </details>
              </div>
            </header>

            <div className="space-y-5 px-3 py-4 sm:space-y-6 sm:px-6 sm:py-6">
              <section className="grid gap-5 lg:grid-cols-[minmax(0,2fr)_320px]">
                <div className="space-y-5">
                  <OnCallStatus />

                  <section>
                    <div className="mb-4 flex items-center justify-between">
                      <h2 className="font-display text-2xl font-extrabold tracking-tight text-zinc-900">
                        Offers Panel
                      </h2>

                      <button type="button" className="text-sm font-bold text-primary hover:text-blue-700">
                        View History
                      </button>
                    </div>

                    {isLoadingAssignments ? (
                      <div className="rounded-3xl border border-[#d8e4ee] bg-white p-6 text-sm text-secondary shadow-soft">
                        Loading pending requests...
                      </div>
                    ) : pendingAssignments.length === 0 ? (
                      <div className="rounded-3xl border border-[#d8e4ee] bg-white p-6 text-sm text-secondary shadow-soft">
                        No pending requests.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {pendingAssignments.map((assignment) =>
                          assignment.priority === "URGENT" ? (
                            <UrgentRequestCard key={assignment.id} assignment={assignment} />
                          ) : (
                            <StandardRequestCard key={assignment.id} assignment={assignment} />
                          ),
                        )}
                      </div>
                    )}
                  </section>
                </div>

                <aside className="space-y-5">
                  <EarningsWidget />
                  <ScheduleWidget />
                  <MapWidget />
                </aside>
              </section>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
