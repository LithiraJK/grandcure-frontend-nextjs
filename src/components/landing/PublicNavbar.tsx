import Link from "next/link";

import { ROUTES } from "@/lib/routes";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "Workers", href: "#workers" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
];

export function PublicNavbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 lg:px-10">
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between rounded-full bg-white/70 px-5 backdrop-blur-md sm:px-7">
        <Link
          href="/"
          className="font-display text-2xl font-extrabold tracking-tight text-[#191c1e] sm:text-3xl"
          aria-label="GrandCure home"
        >
          GrandCure
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-semibold text-[#445767] transition hover:text-[#0f5788]"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <Link
          href={ROUTES.login}
          className="inline-flex h-10 items-center rounded-full border border-[#bfd3e4] bg-white px-5 text-sm font-semibold text-[#184f75] shadow-[0_10px_20px_-18px_rgba(20,38,54,0.55)] transition hover:-translate-y-0.5 hover:border-[#9fc0da] hover:bg-[#f4f9fd]"
        >
          Sign In
        </Link>
      </nav>
    </header>
  );
}
