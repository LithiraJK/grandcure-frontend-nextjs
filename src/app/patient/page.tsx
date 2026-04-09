import {
  Activity,
  Asterisk,
  Bell,
  CalendarDays,
  Check,
  ChevronRight,
  ClipboardList,
  Clock3,
  History,
  Hourglass,
  LayoutDashboard,
  Plus,
  Pill,
  Search,
  User,
} from "lucide-react";
import type { ComponentType } from "react";

import { AuthSessionGuard } from "@/components/auth/AuthSessionGuard";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { BrandLogo } from "@/components/branding/BrandLogo";
import { ROUTES } from "@/lib/routes";

type SidebarLink = {
  label: string;
  icon: ComponentType<{ className?: string }>;
  isActive?: boolean;
};

type RequestStatus = "PENDING" | "ASSIGNED";

type ActiveRequest = {
  id: string;
  title: string;
  details: string;
  metaLabel: string;
  metaValue: string;
  status: RequestStatus;
  icon: ComponentType<{ className?: string }>;
  caregiverName?: string;
};

const primaryLinks: SidebarLink[] = [
  { label: "Dashboard", icon: LayoutDashboard, isActive: true },
  { label: "Requests", icon: ClipboardList },
  { label: "Schedule", icon: CalendarDays },
  { label: "Profile", icon: User },
];

const activeRequests: ActiveRequest[] = [
  {
    id: "post-surgery-care",
    title: "Post-Surgery Care",
    details: "Scheduled for Oct 14 • 09:00 AM - 01:00 PM",
    metaLabel: "EST. DURATION",
    metaValue: "4 Hours",
    status: "PENDING",
    icon: Hourglass,
  },
  {
    id: "morning-wellness-walk",
    title: "Morning Wellness Walk",
    details: "Caregiver: Sarah Mitchell • Tomorrow at 8:30 AM",
    metaLabel: "RATE",
    metaValue: "$28/hr",
    status: "ASSIGNED",
    icon: Clock3,
    caregiverName: "Sarah Mitchell",
  },
];

function GoalProgressBar({ value, label }: { value: number; label: string }) {
  return (
    <div className="space-y-2">
      <div className="h-2.5 w-full rounded-full bg-zinc-200">
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: `${value}%` }}
        />
      </div>
      <p className="text-right text-xs font-semibold tracking-wide text-secondary">
        {label}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: RequestStatus }) {
  if (status === "ASSIGNED") {
    return (
      <span className="inline-flex items-center rounded-full border border-tertiary/30 bg-tertiary/10 px-2 py-0.5 text-[10px] font-bold tracking-[0.08em] text-tertiary">
        ASSIGNED
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full border border-zinc-300 bg-zinc-100 px-2 py-0.5 text-[10px] font-bold tracking-[0.08em] text-zinc-500">
      PENDING
    </span>
  );
}

export default function PatientDashboardPage() {
  return (
    <AuthSessionGuard>
      <main className="h-screen overflow-hidden bg-neutral">
        <div className="flex h-full w-full flex-col lg:flex-row">
          <aside className="flex w-full shrink-0 flex-col border-b border-zinc-200/80 bg-white/95 px-4 py-4 shadow-sm backdrop-blur-lg sm:px-5 lg:h-full lg:w-72 lg:rounded-r-3xl lg:border-b-0 lg:border-r lg:py-6 lg:shadow-xl lg:shadow-[#8cb6cf]/25">
            <div className="space-y-2">
              <BrandLogo href={ROUTES.patient} className="inline-block text-3xl" ariaLabel="Patient dashboard" />
              <p className="text-sm font-medium text-secondary">Patient Portal</p>
            </div>

            <nav className="mt-6 space-y-1.5" aria-label="Primary sidebar navigation">
              {primaryLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.label}
                    type="button"
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
                  </button>
                );
              })}
            </nav>

            <div className="mt-auto border-t border-zinc-200/70 pt-4">
              <SignOutButton />
            </div>
          </aside>

          <section className="min-h-0 min-w-0 flex-1 overflow-hidden p-2 sm:p-4 lg:p-6">
            <div className="h-full overflow-y-auto rounded-2xl border border-zinc-200/70 bg-neutral shadow-sm sm:rounded-3xl">
              <header className="sticky top-0 z-10 flex flex-wrap items-center gap-3 border-b border-zinc-200/70 bg-white/95 px-3 py-3 backdrop-blur sm:px-6 sm:py-4">
                <label className="relative block w-full lg:max-w-xl">
                  <Search
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary"
                  />
                  <input
                    type="search"
                    placeholder="Find care services..."
                    className="h-11 w-full rounded-3xl border border-transparent bg-zinc-100 pl-10 pr-4 text-sm text-zinc-800 outline-none transition placeholder:text-secondary focus:border-primary/30 focus:bg-white"
                  />
                </label>

                <div className="flex w-full items-center justify-end gap-2 sm:gap-3 lg:ml-auto lg:w-auto">
                  <button
                    type="button"
                    className="inline-flex h-10 items-center rounded-full bg-[#d9f2f8] px-3 text-xs font-semibold text-[#0f5b73] transition hover:bg-[#c8ebf4] sm:px-4 sm:text-sm"
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

                  <button
                    type="button"
                    aria-label="Open profile"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#7cd7df] bg-linear-to-br from-[#2bb4c5] to-[#1f8ca0] text-sm font-bold text-white"
                  >
                    E
                  </button>
                </div>
              </header>

              <div className="space-y-5 px-3 py-4 sm:space-y-6 sm:px-6 sm:py-6">
                <section className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
                  <article className="rounded-3xl bg-[#005c97] p-6 text-white shadow-sm sm:p-7">
                    <h1 className="font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
                      Good morning,
                      <br />
                      Evelyn
                    </h1>

                    <p className="mt-4 max-w-md text-sm leading-relaxed text-cyan-100">
                      Your health is our priority. You have 2 caregivers
                      available in your area today.
                    </p>

                    <button
                      type="button"
                      className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-bold text-primary transition hover:bg-zinc-100"
                    >
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
                        <Plus className="h-3.5 w-3.5" />
                      </span>
                      Request Caregiver
                    </button>
                  </article>

                  <article className="rounded-3xl bg-white p-5 shadow-sm sm:p-6">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#d6f4f7] text-[#0a7481]">
                      <Activity className="h-5 w-5" />
                    </span>

                    <h2 className="mt-4 font-display text-2xl font-extrabold tracking-tight text-zinc-900 sm:text-3xl">
                      Daily Progress
                    </h2>

                    <div className="mt-8 flex items-end justify-between gap-4">
                      <p className="font-display text-4xl font-extrabold leading-none text-primary sm:text-5xl">
                        85%
                      </p>
                      <p className="text-sm font-semibold text-secondary">
                        Goal Met
                      </p>
                    </div>

                    <div className="mt-4">
                      <GoalProgressBar value={85} label="Goal Met" />
                    </div>
                  </article>
                </section>

                <section className="space-y-3">
                  <div className="flex flex-wrap items-end justify-between gap-3">
                    <h2 className="font-display text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
                      My Active Requests
                    </h2>

                    <button
                      type="button"
                      className="text-sm font-bold text-primary transition hover:text-blue-700"
                    >
                      View All History
                    </button>
                  </div>

                  <div className="space-y-3">
                    {activeRequests.map((request) => {
                      const RequestIcon = request.icon;

                      return (
                        <article
                          key={request.id}
                          className="flex flex-col gap-4 rounded-3xl bg-white px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:px-5"
                        >
                          <div
                            className={[
                              "inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border",
                              request.status === "ASSIGNED"
                                ? "border-tertiary bg-[#ecf8ed] text-tertiary"
                                : "border-zinc-200 bg-zinc-100 text-zinc-500",
                            ].join(" ")}
                          >
                            {request.status === "ASSIGNED" ? (
                              <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-tertiary bg-white text-xs font-bold text-zinc-700">
                                SM
                                <span className="absolute -bottom-0.5 -right-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-tertiary text-white">
                                  <Check className="h-2.5 w-2.5" />
                                </span>
                              </span>
                            ) : (
                              <RequestIcon className="h-5 w-5" />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-display text-2xl font-bold tracking-tight text-zinc-900">
                                {request.title}
                              </h3>
                              <StatusBadge status={request.status} />
                            </div>
                            <p className="mt-0.5 text-sm text-secondary">
                              {request.details}
                            </p>
                          </div>

                          <div className="flex w-full items-center justify-between gap-4 sm:ml-auto sm:w-auto sm:justify-normal">
                            <div className="text-right">
                              <p className="text-[11px] font-bold tracking-[0.08em] text-secondary">
                                {request.metaLabel}
                              </p>
                              <p className="font-display text-2xl font-extrabold tracking-tight text-zinc-900">
                                {request.metaValue}
                              </p>
                            </div>

                            <button
                              type="button"
                              aria-label={`Open ${request.title} details`}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-secondary transition hover:bg-zinc-100 hover:text-zinc-800"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>

                <section className="grid gap-4 pb-1 sm:grid-cols-2 xl:grid-cols-3">
                  <article className="rounded-3xl bg-[#7bd3de] px-5 py-6 shadow-sm">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#5ebecb] text-[#0f5f6d]">
                      <Pill className="h-5 w-5" />
                    </span>

                    <h3 className="mt-7 font-display text-3xl font-extrabold leading-tight tracking-tight text-[#0a5161] sm:text-4xl">
                      Medication
                      <br />
                      Tracker
                    </h3>

                    <p className="mt-4 text-sm leading-relaxed text-[#1e5e67]">
                      Next dose: 12:30 PM (Blood Pressure)
                    </p>
                  </article>

                  <article className="rounded-3xl bg-[#d8dce1] px-5 py-6 shadow-sm">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#c2c9d0] text-[#4d5a66]">
                      <History className="h-5 w-5" />
                    </span>

                    <h3 className="mt-7 font-display text-3xl font-extrabold leading-tight tracking-tight text-[#2f3f4b] sm:text-4xl">
                      Past Visits
                    </h3>

                    <p className="mt-4 text-sm leading-relaxed text-[#4a5762]">
                      Review 12 completed sessions
                    </p>
                  </article>

                  <article className="relative overflow-hidden rounded-3xl bg-[#f4d3d3] px-5 py-6 shadow-sm sm:col-span-2 xl:col-span-1">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#efb7b8] text-[#a01921]">
                      <Asterisk className="h-5 w-5" />
                    </span>

                    <div className="pointer-events-none absolute -bottom-8 right-3 h-24 w-24 rounded-full bg-[#8f0f1f]/20" />
                    <div className="pointer-events-none absolute bottom-6 right-16 h-12 w-12 rounded-full bg-[#8f0f1f]/12" />

                    <h3 className="mt-7 font-display text-3xl font-extrabold leading-tight tracking-tight text-[#9b111e] sm:text-4xl">
                      Panic Button
                    </h3>

                    <p className="mt-4 max-w-[16rem] text-sm leading-relaxed text-[#9a2a2f]">
                      Instant alert to family &amp; care team
                    </p>

                    <button
                      type="button"
                      aria-label="Trigger panic alert"
                      className="fixed bottom-5 right-5 z-30 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg ring-4 ring-white/70 transition hover:brightness-110 sm:bottom-6 sm:right-6 sm:h-14 sm:w-14"
                    >
                      <Plus className="h-5 w-5 sm:h-6 sm:w-6" />
                    </button>
                  </article>
                </section>
              </div>
            </div>
          </section>
        </div>
      </main>
    </AuthSessionGuard>
  );
}
