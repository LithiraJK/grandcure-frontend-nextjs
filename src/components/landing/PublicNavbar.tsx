import Link from "next/link";

import { ROUTES } from "@/lib/routes";

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

        <Link
          href={ROUTES.login}
          className="inline-flex h-10 items-center rounded-full px-4 text-sm font-semibold text-[#191c1e] transition hover:bg-[#e9f1f8]"
        >
          Login
        </Link>
      </nav>
    </header>
  );
}
