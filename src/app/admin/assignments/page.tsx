"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

import { AdminShell } from "@/components/dashboard/admin/AdminShell";
import { ROUTES } from "@/lib/routes";
import { type AdminAssignment, useAdminStore } from "@/store/useAdminStore";
import { useAuthStore } from "@/store/useAuthStore";

function isAdminRole(role: string | undefined) {
  return (role ?? "").toUpperCase() === "ADMIN";
}

function formatDateLabel(value: string) {
  if (!value.trim()) {
    return "-";
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function normalizeStatus(status: string) {
  return status.toUpperCase();
}

function getStatusBadgeClass(status: string) {
  const normalized = normalizeStatus(status);

  if (normalized === "COMPLETED") {
    return "bg-tertiary/10 text-tertiary";
  }

  if (normalized === "PENDING") {
    return "bg-warning/15 text-warning";
  }

  if (normalized === "ACCEPTED") {
    return "bg-[#dff5f8] text-[#0f5b73]";
  }

  return "bg-zinc-100 text-zinc-700";
}

function formatStatus(status: string) {
  return status
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatServiceType(value: string) {
  if (!value.trim()) {
    return "General Care";
  }

  return value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function renderCaregiverName(assignment: AdminAssignment) {
  if (assignment.caregiverName && assignment.caregiverName.trim()) {
    return assignment.caregiverName;
  }

  return "Not Assigned";
}

export default function AdminAssignmentsPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const role = useAuthStore((state) => state.user?.role);

  const allAssignments = useAdminStore((state) => state.allAssignments);
  const isLoading = useAdminStore((state) => state.isLoading);
  const fetchAllAssignments = useAdminStore((state) => state.fetchAllAssignments);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(ROUTES.login);
      return;
    }

    if (!isAdminRole(role)) {
      router.replace(ROUTES.forbidden);
      return;
    }

    void fetchAllAssignments();
  }, [fetchAllAssignments, isAuthenticated, role, router]);

  const sortedAssignments = useMemo(() => {
    const rows = [...allAssignments];

    rows.sort((left, right) => {
      return right.requestDate.localeCompare(left.requestDate);
    });

    return rows;
  }, [allAssignments]);

  if (!isAuthenticated || !isAdminRole(role)) {
    return null;
  }

  return (
    <AdminShell
      activeItem="reviews"
      title="Platform Assignments Oversight"
      subtitle="Review all care requests across the platform and monitor lifecycle status by patient, caregiver, and service type."
    >
      <section className="rounded-3xl bg-white p-8 shadow-soft">
        {isLoading ? (
          <div className="rounded-3xl bg-[#f4f8fc] p-6 text-sm text-secondary">
            Loading platform assignments...
          </div>
        ) : sortedAssignments.length === 0 ? (
          <div className="rounded-3xl bg-[#f4f8fc] p-6 text-sm text-secondary">
            No assignments found.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-3xl bg-[#f8fbfe] p-4 sm:p-6">
            <table className="w-full min-w-220 border-collapse">
              <thead>
                <tr className="text-left">
                  <th className="px-3 py-3 text-xs font-black uppercase tracking-widest text-secondary">Request Date</th>
                  <th className="px-3 py-3 text-xs font-black uppercase tracking-widest text-secondary">Patient Name</th>
                  <th className="px-3 py-3 text-xs font-black uppercase tracking-widest text-secondary">Caregiver Name</th>
                  <th className="px-3 py-3 text-xs font-black uppercase tracking-widest text-secondary">Service Type</th>
                  <th className="px-3 py-3 text-xs font-black uppercase tracking-widest text-secondary">Status</th>
                </tr>
              </thead>

              <tbody>
                {sortedAssignments.map((assignment) => (
                  <tr key={assignment.id} className="text-sm text-zinc-800">
                    <td className="px-3 py-4 text-secondary">{formatDateLabel(assignment.requestDate)}</td>
                    <td className="px-3 py-4 font-semibold text-zinc-900">{assignment.patientName}</td>
                    <td className="px-3 py-4 text-zinc-700">{renderCaregiverName(assignment)}</td>
                    <td className="px-3 py-4">
                      <span className="inline-flex rounded-full bg-[#edf4fa] px-2.5 py-1 text-[11px] font-bold text-primary">
                        {formatServiceType(assignment.serviceType)}
                      </span>
                    </td>
                    <td className="px-3 py-4">
                      <span
                        className={[
                          "inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold",
                          getStatusBadgeClass(assignment.status),
                        ].join(" ")}
                      >
                        {formatStatus(assignment.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </AdminShell>
  );
}
