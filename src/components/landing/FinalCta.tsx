import Link from "next/link";

import { ROUTES } from "@/lib/routes";

export function FinalCta() {
  return (
    <section className="bg-[#f7f9fc] px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
      <div className="mx-auto w-full max-w-7xl rounded-[2.5rem] bg-white p-12 sm:p-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div className="space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#3c596f]">
              Begin Today
            </p>
            <h2 className="font-display text-4xl font-extrabold tracking-tight text-[#191c1e] sm:text-5xl">
              Start your curated care journey with confidence.
            </h2>
            <p className="max-w-2xl text-base leading-relaxed text-[#3a4248]">
              Connect with verified caregivers, access real-time visibility, and provide your
              loved ones with a sanctuary-level care experience.
            </p>
          </div>

          <div className="flex flex-col items-start gap-4 lg:items-end">
            <Link
              href={ROUTES.register}
              className="inline-flex h-12 items-center rounded-full bg-gradient-to-r from-[#00497a] to-[#11629d] px-7 text-sm font-semibold text-white transition duration-200 hover:scale-105 hover:shadow-[0_12px_30px_-18px_rgba(17,98,157,0.85)]"
            >
              Create Account
            </Link>
            <Link
              href={ROUTES.login}
              className="inline-flex h-11 items-center rounded-full px-5 text-sm font-semibold text-[#191c1e] transition hover:bg-[#e9f1f8]"
            >
              Login to Portal
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
