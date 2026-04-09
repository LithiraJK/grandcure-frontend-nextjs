"use client";

import { CalendarDays, ClipboardList, LayoutDashboard, User } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { ActiveRequests } from "@/components/dashboard/patient/ActiveRequests";
import { PatientHistory } from "@/components/dashboard/patient/PatientHistory";
import { RequestCareModal } from "@/components/dashboard/patient/RequestCareModal";
import { AuthSessionGuard } from "@/components/auth/AuthSessionGuard";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { BrandLogo } from "@/components/branding/BrandLogo";
import { ROUTES } from "@/lib/routes";
import { useAssignmentStore } from "@/store/useAssignmentStore";
import { useAuthStore } from "@/store/useAuthStore";

type SidebarLink = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  isActive?: boolean;
};

const primaryLinks: SidebarLink[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: ROUTES.patient, isActive: true },
  { label: "Requests", icon: ClipboardList, href: "/patient/request" },
  { label: "Schedule", icon: CalendarDays, href: "/patient/schedule" },
  { label: "Profile", icon: User, href: "/patient/profile" },
];

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
      <main className="h-screen overflow-hidden bg-[#f2f6fa]">
        <div className="flex h-full w-full flex-col lg:flex-row">
          <aside className="flex w-full shrink-0 flex-col bg-white/95 px-4 py-4 shadow-sm backdrop-blur-lg sm:px-5 lg:h-full lg:w-72 lg:rounded-r-3xl lg:py-6 lg:shadow-xl lg:shadow-[#8cb6cf]/25">
            <div className="space-y-2">
              <BrandLogo href={ROUTES.patient} className="inline-block text-3xl" ariaLabel="Patient dashboard" />
              <p className="text-sm font-medium text-secondary">Patient Portal</p>
            </div>

            <nav className="mt-6 space-y-1.5" aria-label="Primary sidebar navigation">
              {primaryLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className={[
                      "group flex h-11 w-full items-center gap-3 rounded-2xl px-3 text-left text-sm font-semibold transition",
                      item.isActive
                        ? "bg-linear-to-r from-[#e7f4ff] to-[#f2f9ff] text-[#0d567a] shadow-sm ring-1 ring-[#b8def3]"
                        : "text-zinc-700 hover:bg-[#eef6ff] hover:text-[#0b5476]",
                    ].join(" ")}
                    aria-current={item.isActive ? "page" : undefined}
                  >
                    <Icon className="h-4 w-4 transition group-hover:scale-105" />
                    <span>{item.label}</span>
                  </a>
                );
              })}
            </nav>

            <div className="mt-auto border-t border-zinc-200/70 pt-4">
              <SignOutButton />
            </div>
          </aside>

          <section className="min-h-0 min-w-0 flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
              <div className="mx-auto max-w-6xl space-y-8">
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
              </div>

                {activeRequestsCount > 0 ? <ActiveRequests /> : null}

                <PatientHistory />
            </div>
          </section>
        </div>
      </main>

        <RequestCareModal
          isOpen={isRequestModalOpen}
          onClose={() => setIsRequestModalOpen(false)}
          profileAddress={profileAddress}
          profileCoordinates={profileCoordinates}
        />
    </AuthSessionGuard>
  );
}
