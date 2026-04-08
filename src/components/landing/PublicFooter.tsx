import Link from "next/link";
import { BookOpenText, Share2 } from "lucide-react";

import { ROUTES } from "@/lib/routes";

export function PublicFooter() {
  return (
    <footer className="px-4 py-10 sm:px-6 lg:px-10 lg:py-12">
    <hr className="my-10" />
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 text-[#5f7487] lg:grid-cols-[1fr_auto_auto] lg:items-center">
        <div>
          <p className="font-display text-2xl font-extrabold tracking-tight text-[#1f4f73]">GrandCure</p>
          <p className="mt-2 text-sm leading-relaxed sm:text-base">
            @ 2026 GrandCure. Editorial Healthcare
            <br />
            for the Golden Generation.
          </p>
        </div>

        <nav className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm font-semibold text-[#6f8293]">
          <Link href={ROUTES.login} className="transition hover:text-[#2b607f]">
            Privacy Policy
          </Link>
          <Link href={ROUTES.register} className="transition hover:text-[#2b607f]">
            Terms of Service
          </Link>
          <Link href={ROUTES.login} className="transition hover:text-[#2b607f]">
            Accessibility Statement
          </Link>
          <Link href={ROUTES.register} className="transition hover:text-[#2b607f]">
            Contact Us
          </Link>
        </nav>
      </div>
    </footer>
  );
}
