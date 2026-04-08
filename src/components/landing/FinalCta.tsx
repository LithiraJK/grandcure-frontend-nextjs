import Link from "next/link";

import { ROUTES } from "@/lib/routes";

export function FinalCta() {
  return (
    <section className="bg-[#f7f9fc] px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
      <div className="mx-auto w-full max-w-7xl overflow-hidden rounded-[2.6rem] border border-[#d3e0eb] bg-[linear-gradient(135deg,#f9fcff_0%,#edf5fb_55%,#eef8fa_100%)] p-8 shadow-[0_32px_64px_-42px_rgba(20,38,54,0.6)] sm:p-12 lg:p-14">
        <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-[1.35fr_1fr] lg:items-center">
          <div className="pointer-events-none absolute -left-10 top-0 h-40 w-40 rounded-full bg-[#9ac8eb]/20 blur-3xl" />
          <div className="pointer-events-none absolute -right-8 bottom-0 h-44 w-44 rounded-full bg-[#9fded3]/18 blur-3xl" />

          <div className="relative space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#3c596f]">
              Begin Today
            </p>

            <h2 className="font-display text-4xl font-extrabold tracking-tight text-[#182330] sm:text-5xl">
              Start your curated care journey with confidence.
            </h2>

            <p className="max-w-2xl text-base leading-relaxed text-[#445260] sm:text-lg">
              Connect with verified caregivers, access real-time visibility, and provide your
              loved ones with a sanctuary-level care experience.
            </p>

            <div className="flex flex-wrap gap-3 pt-1">
              <span className="inline-flex items-center rounded-full border border-[#c6d8ea] bg-white/85 px-3 py-1.5 text-xs font-semibold text-[#2f4b63]">
                100% Verified Professionals
              </span>
              <span className="inline-flex items-center rounded-full border border-[#c7e2db] bg-white/85 px-3 py-1.5 text-xs font-semibold text-[#2d5f57]">
                Real-Time Care Updates
              </span>
              <span className="inline-flex items-center rounded-full border border-[#d2dce8] bg-white/85 px-3 py-1.5 text-xs font-semibold text-[#455468]">
                Secure Family Dashboard
              </span>
            </div>
          </div>

          <div className="relative flex flex-col items-start gap-3 rounded-3xl border border-[#d6e3ee] bg-white/70 p-5 backdrop-blur-sm sm:p-6 lg:items-stretch">
            <Link
              href={ROUTES.register}
              className="inline-flex h-12 w-full items-center justify-center rounded-full bg-gradient-to-r from-[#00497a] to-[#11629d] px-7 text-sm font-semibold text-white transition duration-200 hover:scale-[1.01] hover:shadow-[0_12px_30px_-18px_rgba(17,98,157,0.85)]"
            >
              Create Account
            </Link>

            <Link
              href={ROUTES.login}
              className="inline-flex h-11 w-full items-center justify-center rounded-full border border-[#c3d8e8] bg-white/90 px-5 text-sm font-semibold text-[#184f75] transition hover:border-[#9fc0da] hover:bg-[#f4f9fd]"
            >
              Sign In to Portal
            </Link>

            <p className="pt-1 text-center text-xs leading-relaxed text-[#617180]">
              Start your care journey today with confidence and peace of mind.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
