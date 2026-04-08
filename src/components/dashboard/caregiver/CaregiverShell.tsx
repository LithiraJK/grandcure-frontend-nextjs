"use client";

import {
  Bell,
  CircleHelp,
  ClipboardList,
  LayoutDashboard,
  Search,
  User,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { useMemo } from "react";

import { SignOutButton } from "@/components/auth/SignOutButton";
import { BrandLogo } from "@/components/branding/BrandLogo";
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
  { key: "profile", label: "Profile", href: ROUTES.caregiverProfile, icon: User },
  { key: "escalation", label: "Admin Escalation", icon: CircleHelp },
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
    <main className="h-screen overflow-hidden bg-white">
      <div className="flex h-full w-full flex-col lg:flex-row">
        <aside className="flex w-full shrink-0 flex-col border-b border-zinc-200/80 bg-white/95 px-4 py-4 shadow-sm backdrop-blur-lg sm:px-5 lg:h-full lg:w-72 lg:rounded-r-3xl lg:border-b-0 lg:border-r lg:py-6 lg:shadow-xl lg:shadow-[#8cb6cf]/25">
          <div className="space-y-2">
            <BrandLogo href={ROUTES.caregiver} className="inline-block text-3xl" ariaLabel="Caregiver dashboard" />
            <p className="text-sm font-medium text-secondary">Caregiver Portal</p>
    
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
                    className="group flex h-11 w-full items-center gap-3 rounded-2xl px-3 text-left text-sm font-semibold text-zinc-700 transition hover:bg-[#eef6ff] hover:text-[#0b5476]"
                  >
                    <Icon className="h-4 w-4 transition group-hover:scale-105" />
                    <span>{item.label}</span>
                  </button>
                );
              }

              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={[
                    "group flex h-11 w-full items-center gap-3 rounded-2xl px-3 text-left text-sm font-semibold transition",
                    isActive
                      ? "bg-linear-to-r from-[#e7f4ff] to-[#f2f9ff] text-[#0d567a] shadow-sm ring-1 ring-[#b8def3]"
                      : "text-zinc-700 hover:bg-[#eef6ff] hover:text-[#0b5476]",
                  ].join(" ")}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className="h-4 w-4 transition group-hover:scale-105" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto border-t border-zinc-200/70 pt-4">
            <SignOutButton />
          </div>
        </aside>

        <section className="min-h-0 min-w-0 flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto rounded-2xl bg-white shadow-xl shadow-[#8cb6cf]/15 backdrop-blur sm:rounded-3xl">
            <header className="sticky top-0 z-10 flex flex-wrap items-center gap-3 border-b border-[#d7e9f5] bg-white/70 px-3 py-3 backdrop-blur sm:px-6 sm:py-4">
              <div>
                <p className="font-display text-xl font-extrabold tracking-tight text-[#0d3f61]">Caregiver Workspace</p>
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
                  className="h-11 w-full rounded-3xl border border-transparent bg-[#eef5fb] pl-10 pr-4 text-sm text-zinc-800 outline-none transition placeholder:text-secondary focus:border-[#8ec7e8] focus:bg-white"
                />
              </label>

              <div className="flex w-full items-center justify-end gap-2 sm:gap-3 lg:ml-auto lg:w-auto">
                <button
                  type="button"
                  className="inline-flex h-10 items-center rounded-full bg-linear-to-r from-[#0f6d95] to-[#1799b5] px-3 text-xs font-semibold text-white shadow-md transition hover:from-[#0d5f83] hover:to-[#14859d] sm:px-4 sm:text-sm"
                >
                  Emergency Support
                </button>

                <button
                  type="button"
                  aria-label="Notifications"
                  className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#cfe3f2] bg-white text-zinc-700 transition hover:bg-[#eef6ff]"
                >
                  <Bell className="h-4 w-4" />
                  <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-500" />
                </button>

                <details className="relative">
                  <summary className="list-none">
                    <button
                      type="button"
                      aria-label="Open profile menu"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#9fd7ee] bg-linear-to-br from-[#2f89b0] to-[#1e6f98] text-sm font-bold text-white shadow-md"
                    >
                      {profileInitial}
                    </button>
                  </summary>

                  <div className="absolute right-0 top-12 z-20 w-56 rounded-2xl border border-[#d1e6f4] bg-white p-3 shadow-xl">
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

            <div className="space-y-5 px-3 py-4 sm:space-y-6 sm:px-6 sm:py-6 lg:px-10">{children}</div>
          </div>
        </section>
      </div>
    </main>
  );
}
