"use client";

import { LayoutDashboard, Star, UsersRound } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { SignOutButton } from "@/components/auth/SignOutButton";

type AdminShellProps = {
  children: ReactNode;
  activeItem: "dashboard" | "users" | "reviews";
  title: string;
  subtitle: string;
};

type NavItem = {
  key: "dashboard" | "users" | "reviews";
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

const navItems: NavItem[] = [
  { key: "dashboard", label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { key: "users", label: "Users", href: "/admin/users", icon: UsersRound },
  { key: "reviews", label: "Reviews", href: "/admin/reviews", icon: Star },
];

export function AdminShell({ children, activeItem, title, subtitle }: AdminShellProps) {
  return (
    <main className="h-screen overflow-hidden bg-neutral">
      <div className="flex h-full w-full flex-col lg:flex-row">
        <aside className="flex w-full shrink-0 flex-col border-b border-zinc-200/80 bg-white px-4 py-4 sm:px-5 lg:h-full lg:w-64 lg:border-b-0 lg:border-r lg:py-6">
          <div className="space-y-1">
            <p className="text-sm font-bold text-primary">Admin Panel</p>
            <p className="text-xs text-secondary">GrandCure Management</p>
          </div>

          <nav className="mt-6 space-y-1.5" aria-label="Admin navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.key;

              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={[
                    "flex h-11 items-center gap-3 rounded-2xl px-3 text-sm font-semibold transition",
                    isActive
                      ? "bg-[#edf4fa] text-primary"
                      : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900",
                  ].join(" ")}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-4">
            <SignOutButton />
          </div>
        </aside>

        <section className="min-h-0 min-w-0 flex-1 overflow-hidden p-2 sm:p-4 lg:p-6">
          <div className="h-full overflow-y-auto rounded-2xl border border-zinc-200/70 bg-neutral shadow-sm sm:rounded-3xl">
            <section className="mx-auto max-w-7xl space-y-6 px-3 py-4 sm:px-6 sm:py-6">
              <header className="rounded-3xl border border-[#d8e4ee] bg-white p-6 shadow-soft sm:p-7">
                <p className="text-xs font-black uppercase tracking-[0.12em] text-primary">GrandCure Admin</p>
                <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
                  {title}
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-secondary">{subtitle}</p>
              </header>

              {children}
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
