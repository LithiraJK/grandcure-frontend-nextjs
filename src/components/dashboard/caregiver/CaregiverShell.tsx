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
import Link from "next/link";
import type { ReactNode } from "react";
import { useMemo } from "react";

import { SignOutButton } from "@/components/auth/SignOutButton";
import { ROUTES } from "@/lib/routes";
import { useAuthStore } from "@/store/useAuthStore";

type CaregiverShellProps = {
  children: ReactNode;
  activeItem: "dashboard" | "profile";
  pageSubtitle?: string;
};

type NavItem = {
  key: "dashboard" | "requests" | "schedule" | "profile" | "escalation";
  label: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
};

const primaryNavItems: NavItem[] = [
  { key: "dashboard", label: "Dashboard", href: ROUTES.caregiver, icon: LayoutDashboard },
  { key: "requests", label: "Requests", icon: ClipboardList },
  { key: "schedule", label: "Schedule", icon: ClipboardList },
  { key: "profile", label: "Profile", href: `${ROUTES.caregiver}/profile`, icon: User },
  { key: "escalation", label: "Admin Escalation", icon: CircleHelp },
];

const secondaryNavItems = [
  { label: "Settings", icon: Settings },
  { label: "Help", icon: CircleHelp },
];

export function CaregiverShell({ children, activeItem, pageSubtitle }: CaregiverShellProps) {
  const userEmail = useAuthStore((state) => state.user?.email);

  const profileInitial = useMemo(() => {
    if (!userEmail) {
      return "C";
    }

    return userEmail.charAt(0).toUpperCase();
  }, [userEmail]);

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
              const isActive = item.key === activeItem;

              if (!item.href) {
                return (
                  <button
                    key={item.key}
                    type="button"
                    className="flex h-11 w-full items-center gap-3 rounded-2xl px-3 text-left text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-900"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </button>
                );
              }

              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={[
                    "flex h-11 w-full items-center gap-3 rounded-2xl px-3 text-left text-sm font-semibold transition",
                    isActive
                      ? "bg-[#edf4fa] text-primary"
                      : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900",
                  ].join(" ")}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
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
              <div>
                <p className="font-display text-2xl font-extrabold tracking-tight text-primary">GrandCure</p>
                {pageSubtitle ? <p className="text-xs text-secondary">{pageSubtitle}</p> : null}
              </div>

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
                <button
                  type="button"
                  className="inline-flex h-10 items-center rounded-full bg-[#bdeef5] px-3 text-xs font-semibold text-[#0f5b73] transition hover:bg-[#aae7f2] sm:px-4 sm:text-sm"
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

            <div className="space-y-5 px-3 py-4 sm:space-y-6 sm:px-6 sm:py-6">{children}</div>
          </div>
        </section>
      </div>
    </main>
  );
}
