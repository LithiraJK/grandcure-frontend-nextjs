import {
  Activity,
  Asterisk,
  Bell,
  CalendarDays,
  Check,
  ChevronRight,
  CircleHelp,
  ClipboardList,
  Clock3,
  History,
  Hourglass,
  LayoutDashboard,
  Plus,
  Pill,
  Search,
  Settings,
  User,
} from "lucide-react";
import type { ComponentType } from "react";

import { AuthSessionGuard } from "@/components/auth/AuthSessionGuard";

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
  { label: "Medication", icon: Pill },
];

const footerLinks: SidebarLink[] = [
  { label: "Settings", icon: Settings },
  { label: "Help", icon: CircleHelp },
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
        <div className="h-full rounded-full bg-primary" style={{ width: `${value}%` }} />
      </div>
      <p className="text-right text-xs font-semibold tracking-wide text-secondary">{label}</p>
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

export default function DashboardPage() {
  return (
    <AuthSessionGuard>
      <main className="h-screen overflow-hidden bg-neutral">
        <div className="mx-auto flex h-full w-full max-w-350">
          <aside className="flex h-full w-59 shrink-0 flex-col border-r border-zinc-200/80 bg-white px-5 py-6">
            <div className="space-y-1">
              <p className="font-display text-2xl font-extrabold tracking-tight text-primary">GrandCure</p>
              <p className="text-xs font-medium text-secondary">Patient Portal</p>
            </div>

            <nav className="mt-8 space-y-1.5" aria-label="Primary sidebar navigation">
              {primaryLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.label}
                    type="button"
                    className={[
                      "flex h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-semibold transition",
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

            <nav className="mt-auto space-y-1.5" aria-label="Sidebar secondary navigation">
              {footerLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.label}
                    type="button"
                    className="flex h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-900"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          <section className="min-w-0 flex-1 overflow-hidden p-4 sm:p-6">
            <div className="h-full overflow-y-auto rounded-2xl border border-zinc-200/70 bg-neutral shadow-sm">
              <header className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200/70 bg-white/95 px-4 py-4 backdrop-blur sm:px-6">
                <label className="relative block w-full max-w-xl">
                  <Search
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary"
                  />
                  <input
                    type="search"
                    placeholder="Find care services..."
                    className="h-11 w-full rounded-2xl border border-transparent bg-zinc-100 pl-10 pr-4 text-sm text-zinc-800 outline-none transition placeholder:text-secondary focus:border-primary/30 focus:bg-white"
                  />
                </label>

                <div className="ml-auto flex items-center gap-2 sm:gap-3">
                  <button
                    type="button"
                    className="inline-flex h-10 items-center rounded-full bg-[#d9f2f8] px-4 text-sm font-semibold text-[#0f5b73] transition hover:bg-[#c8ebf4]"
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

              <div className="space-y-6 px-4 py-5 sm:px-6 sm:py-6">
                <section className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)]">
                  <article className="rounded-2xl bg-[#005c97] p-6 text-white shadow-sm sm:p-7">
                    <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight">
                      Good morning,
                      <br />
                      Evelyn
                    </h1>

                    <p className="mt-4 max-w-md text-sm leading-relaxed text-cyan-100">
                      Your health is our priority. You have 2 caregivers available in your area
                      today.
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

                  <article className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#d6f4f7] text-[#0a7481]">
                      <Activity className="h-5 w-5" />
                    </span>

                    <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-zinc-900">
                      Daily Progress
                    </h2>

                    <div className="mt-8 flex items-end justify-between gap-4">
                      <p className="font-display text-5xl font-extrabold leading-none text-primary">85%</p>
                      <p className="text-sm font-semibold text-secondary">Goal Met</p>
                    </div>

                    <div className="mt-4">
                      <GoalProgressBar value={85} label="Goal Met" />
                    </div>
                  </article>
                </section>

                <section className="space-y-3">
                  <div className="flex items-end justify-between gap-3">
                    <h2 className="font-display text-4xl font-extrabold tracking-tight text-zinc-900">
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
                          className="flex items-center gap-4 rounded-2xl bg-white px-4 py-4 shadow-sm sm:px-5"
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
                            <p className="mt-0.5 text-sm text-secondary">{request.details}</p>
                          </div>

                          <div className="ml-auto flex items-center gap-4">
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

                <section className="grid gap-4 pb-1 md:grid-cols-3">
                  <article className="rounded-2xl bg-[#7bd3de] px-5 py-6 shadow-sm">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#5ebecb] text-[#0f5f6d]">
                      <Pill className="h-5 w-5" />
                    </span>

                    <h3 className="mt-7 font-display text-4xl font-extrabold leading-tight tracking-tight text-[#0a5161]">
                      Medication
                      <br />
                      Tracker
                    </h3>

                    <p className="mt-4 text-sm leading-relaxed text-[#1e5e67]">
                      Next dose: 12:30 PM (Blood Pressure)
                    </p>
                  </article>

                  <article className="rounded-2xl bg-[#d8dce1] px-5 py-6 shadow-sm">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#c2c9d0] text-[#4d5a66]">
                      <History className="h-5 w-5" />
                    </span>

                    <h3 className="mt-7 font-display text-4xl font-extrabold leading-tight tracking-tight text-[#2f3f4b]">
                      Past Visits
                    </h3>

                    <p className="mt-4 text-sm leading-relaxed text-[#4a5762]">Review 12 completed sessions</p>
                  </article>

                  <article className="relative overflow-hidden rounded-2xl bg-[#f4d3d3] px-5 py-6 shadow-sm">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#efb7b8] text-[#a01921]">
                      <Asterisk className="h-5 w-5" />
                    </span>

                    <div className="pointer-events-none absolute -bottom-8 right-3 h-24 w-24 rounded-full bg-[#8f0f1f]/20" />
                    <div className="pointer-events-none absolute bottom-6 right-16 h-12 w-12 rounded-full bg-[#8f0f1f]/12" />

                    <h3 className="mt-7 font-display text-4xl font-extrabold leading-tight tracking-tight text-[#9b111e]">
                      Panic Button
                    </h3>

                    <p className="mt-4 max-w-[16rem] text-sm leading-relaxed text-[#9a2a2f]">
                      Instant alert to family &amp; care team
                    </p>

                    <button
                      type="button"
                      aria-label="Trigger panic alert"
                      className="absolute bottom-6 right-5 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-md transition hover:brightness-110"
                    >
                      <Plus className="h-6 w-6" />
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
