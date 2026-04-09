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

  const welcomeName = useMemo(() => {
    if (!authUser) {
      return "there";
    }

    const rawUser = authUser as Record<string, unknown>;
    const nameCandidate = typeof rawUser.name === "string" ? rawUser.name.trim() : "";

    if (nameCandidate) {
      return nameCandidate;
    }

    const emailCandidate = typeof rawUser.email === "string" ? rawUser.email.trim() : "";

    if (!emailCandidate) {
      return "there";
    }

    const [localPart] = emailCandidate.split("@");

    return localPart || "there";
  }, [authUser]);

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
          <section className="rounded-[2.5rem] bg-linear-to-br from-[#0f6f9a] to-[#0a5f88] p-8 shadow-soft sm:p-10">
            <div className="space-y-6">
              <div className="space-y-3">
                <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-[#b8dcf3] sm:text-5xl">
                  Welcome back,
                  <br />
                  {welcomeName}
                </h1>
                <p className="max-w-2xl text-lg leading-relaxed text-[#9cc9e7] sm:text-xl">
                  Your health is our priority. You have 2 caregivers
                  available in your area today.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsRequestModalOpen(true)}
                className="inline-flex h-14 items-center gap-3 rounded-full bg-white px-7 text-base font-bold text-[#0a4c76] shadow-lg transition hover:bg-[#f3f8fc]"
              >
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#0a4c76] text-sm text-white">
                  +
                </span>
                Request Caregiver
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
