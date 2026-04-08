"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

import { CaregiverShell } from "@/components/dashboard/caregiver/CaregiverShell";
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

export default function CaregiverDashboardPage() {
  const router = useRouter();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const userRole = useAuthStore((state) => state.user?.role);

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
    <CaregiverShell activeItem="dashboard">
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
    </CaregiverShell>
  );
}
