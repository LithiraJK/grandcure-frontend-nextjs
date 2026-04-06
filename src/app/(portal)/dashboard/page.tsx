import {
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  Pill,
  Settings,
  User,
  CircleHelp,
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
            <div className="h-full rounded-2xl border border-zinc-200/70 bg-white/70 shadow-sm" />
          </section>
        </div>
      </main>
    </AuthSessionGuard>
  );
}
