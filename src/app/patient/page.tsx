"use client";

import { useEffect, useMemo, useState } from "react";

import { ActiveRequests } from "@/components/dashboard/patient/ActiveRequests";
import { PatientHistory } from "@/components/dashboard/patient/PatientHistory";
import { RequestCareModal } from "@/components/dashboard/patient/RequestCareModal";
import { PatientShell } from "@/components/dashboard/patient/PatientShell";
import { AuthSessionGuard } from "@/components/auth/AuthSessionGuard";
import { useAssignmentStore } from "@/store/useAssignmentStore";
import { useAuthStore } from "@/store/useAuthStore";

export default function PatientDashboardPage() {
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const fetchPatientAssignments = useAssignmentStore((state) => state.fetchPatientAssignments);
  const patientAssignments = useAssignmentStore((state) => state.patientAssignments);
  const authUser = useAuthStore((state) => state.user);

  useEffect(() => {
    void fetchPatientAssignments();
  }, [fetchPatientAssignments]);

  const activeRequestsCount = useMemo(
    () =>
      patientAssignments.filter((assignment) =>
        assignment.status === "PENDING"
        || assignment.status === "ACCEPTED"
        || assignment.status === "IN_PROGRESS").length,
    [patientAssignments],
  );

  const profileAddress = useMemo(() => {
    if (!authUser) {
      return "";
    }

    const rawUser = authUser as Record<string, unknown>;
    const addressCandidates = [
      rawUser.address,
      rawUser.fullAddress,
      rawUser.location,
      rawUser.city,
    ];

    const resolved = addressCandidates.find(
      (value) => typeof value === "string" && value.trim().length > 0,
    );

    return typeof resolved === "string" ? resolved.trim() : "";
  }, [authUser]);

  const profileCoordinates = useMemo(() => {
    if (!authUser) {
      return null;
    }

    const rawUser = authUser as Record<string, unknown>;
    const latitude = Number(rawUser.latitude);
    const longitude = Number(rawUser.longitude);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return null;
    }

    return {
      latitude,
      longitude,
    };
  }, [authUser]);

  return (
    <AuthSessionGuard>
      <PatientShell activeItem="dashboard" pageSubtitle="Patient Dashboard">
        <section className="mx-auto max-w-6xl space-y-8 px-1 py-2">
          <section className="rounded-3xl bg-white/90 p-8 shadow-soft">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-2">
                <p className="text-xs font-black uppercase tracking-widest text-primary">Patient Dashboard</p>
                <h1 className="font-display text-4xl font-extrabold tracking-tight text-zinc-900">
                  Curated Care Sanctuary
                </h1>
                <p className="max-w-2xl text-sm leading-relaxed text-secondary">
                  Manage care requests, monitor active visits, and review completed services
                  with a calm, editorial-first workspace.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsRequestModalOpen(true)}
                className="inline-flex h-12 items-center rounded-full bg-linear-to-r from-[#0f6d95] to-[#1799b5] px-6 text-sm font-bold text-white shadow-lg transition hover:from-[#0d5f83] hover:to-[#14859d]"
              >
                ➕ Request Care
              </button>
            </div>
          </section>

          {activeRequestsCount > 0 ? <ActiveRequests /> : null}

          <PatientHistory />
        </section>

        <RequestCareModal
          isOpen={isRequestModalOpen}
          onClose={() => setIsRequestModalOpen(false)}
          profileAddress={profileAddress}
          profileCoordinates={profileCoordinates}
        />
      </PatientShell>
    </AuthSessionGuard>
  );
}
