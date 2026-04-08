import { SquarePlus, UserRound } from "lucide-react";
import Link from "next/link";

export default function RegisterRolePage() {
  return (
    <div className="mx-auto w-full max-w-2xl rounded-[2.25rem] border border-[#e3e8ef] bg-[#f8fafc]/96 p-6 shadow-[0_32px_70px_-46px_rgba(20,38,54,0.62)] sm:p-8 md:p-9">
      <div className="mb-6 flex items-center gap-4 sm:mb-8">
        <div className="h-1.5 w-16 rounded-full bg-[#0b6c2f]" />
        <div className="h-1.5 w-16 rounded-full bg-[#bcd8f7]" />
        <p className="text-xs font-semibold text-[#7a838e] sm:text-sm">
          Step 1 of 2
        </p>
      </div>

      <div className="space-y-2">
        <h1 className="font-display text-3xl font-bold tracking-tight text-[#23282d] sm:text-[2.2rem]">
          How would you like to join?
        </h1>
        <p className="text-sm leading-relaxed text-[#6b7580] sm:text-base">
          Please select the account type that best describes you.
        </p>
      </div>

      <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-2">
        <article className="group rounded-[1.6rem] border border-[#dce2ea] bg-[#eff3f8] p-5 transition duration-200 hover:-translate-y-0.5 hover:border-[#b8cde2] hover:shadow-[0_18px_34px_-24px_rgba(31,56,79,0.5)] sm:p-6">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#cde1fb] text-[#0d5d95]">
            <UserRound aria-hidden="true" className="h-5 w-5" strokeWidth={2} />
          </span>

          <h2 className="mt-5 font-display text-[1.75rem] font-bold leading-tight text-[#20262c]">
            I am a Patient
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#5f6974]">
            Access personalized care, schedule appointments, and manage your health records effortlessly.
          </p>

          <Link
            href="/register/details?role=patient"
            className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#1a6aa0] transition group-hover:translate-x-0.5"
          >
            Get Started
            <span aria-hidden="true">→</span>
          </Link>
        </article>

        <article className="group rounded-[1.6rem] border border-[#dce2ea] bg-[#eff3f8] p-5 transition duration-200 hover:-translate-y-0.5 hover:border-[#bad9be] hover:shadow-[0_18px_34px_-24px_rgba(31,56,79,0.5)] sm:p-6">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#b8ecb8] text-[#0f6d2f]">
            <SquarePlus aria-hidden="true" className="h-5 w-5" strokeWidth={2} />
          </span>

          <h2 className="mt-5 font-display text-[1.75rem] font-bold leading-tight text-[#20262c]">
            I am a Caregiver
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#5f6974]">
            Join our community of compassionate care providers, manage patient details, and streamline your caregiving workflow.
          </p>

          <Link
            href="/register/details?role=caregiver"
            className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#1f7a32] transition group-hover:translate-x-0.5"
          >
            Get Started
            <span aria-hidden="true">→</span>
          </Link>
        </article>
      </div>

      <p className="mt-8 text-center text-sm text-[#6f7781]">
        Already have a GrandCure account?{" "}
        <Link href="/login" className="font-bold text-[#1a6aa0] hover:text-[#11527c]">
          Sign In
        </Link>
      </p>
    </div>
  );
}
