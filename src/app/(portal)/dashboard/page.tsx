import {
  Activity,
  Bell,
  CalendarDays,
  CircleHelp,
  ClipboardList,
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
              </div>
            </div>
          </section>
        </div>
      </main>
    </AuthSessionGuard>
  );
}
