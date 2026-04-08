import Link from "next/link";

import { ROUTES } from "@/lib/routes";

export function PublicFooter() {
  return (
    <footer className="bg-[#f7f9fc] px-4 pb-10 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 rounded-3xl bg-white px-8 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-10">
        <div>
          <p className="font-display text-2xl font-extrabold tracking-tight text-[#191c1e]">GrandCure</p>
          <p className="mt-1 text-sm leading-relaxed text-[#4b545b]">
            Curated elderly care with verified professionals.
          </p>
        </div>

        <nav className="flex flex-wrap items-center gap-3 text-sm font-semibold text-[#191c1e]">
          <Link href={ROUTES.login} className="rounded-full px-3 py-2 transition hover:bg-[#e9f1f8]">
            Login
          </Link>
          <Link href={ROUTES.register} className="rounded-full px-3 py-2 transition hover:bg-[#e9f1f8]">
            Register
          </Link>
        </nav>
      </div>
    </footer>
  );
}
