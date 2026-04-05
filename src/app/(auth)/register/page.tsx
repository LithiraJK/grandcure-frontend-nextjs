import Link from "next/link";

export default function RegisterRolePage() {
  return (
    <div className="mx-auto w-full max-w-2xl rounded-4xl border border-zinc-200/80 bg-white p-6 shadow-soft sm:p-8">
      <div className="mb-6 flex items-center gap-4 sm:mb-8">
        <div className="h-1.5 w-12 rounded-full bg-tertiary" />
        <div className="h-1.5 w-12 rounded-full bg-primary/25" />
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-secondary">
          Step 1 of 2
        </p>
      </div>

      <div className="space-y-2">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-[2.15rem]">
          How would you like to join?
        </h1>
        <p className="text-sm leading-relaxed text-secondary">
          Please select the account type that best describes you.
        </p>
      </div>

      <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-2">
        <article className="group rounded-3xl border border-primary/10 bg-zinc-100/70 p-5 transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-soft sm:p-6">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary/15 text-primary">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21a8 8 0 0 0-16 0" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </span>

          <h2 className="mt-5 font-display text-2xl font-bold text-zinc-900">I am a Patient</h2>
          <p className="mt-2 text-sm leading-relaxed text-secondary">
            Access personalized care, schedule appointments, and manage your health records effortlessly.
          </p>

          <Link
            href="/register/details?role=patient"
            className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-primary transition group-hover:translate-x-0.5"
          >
            Get Started
            <span aria-hidden="true">→</span>
          </Link>
        </article>

        <article className="group rounded-3xl border border-tertiary/10 bg-zinc-100/70 p-5 transition hover:-translate-y-0.5 hover:border-tertiary/30 hover:shadow-soft sm:p-6">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-tertiary/20 text-tertiary">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="4" y="4" width="16" height="16" rx="3" />
              <path d="M12 8v8" />
              <path d="M8 12h8" />
            </svg>
          </span>

          <h2 className="mt-5 font-display text-2xl font-bold text-zinc-900">I am a Caregiver</h2>
          <p className="mt-2 text-sm leading-relaxed text-secondary">
            Join our community of compassionate care providers, manage patient details, and streamline your caregiving workflow.
          </p>

          <Link
            href="/register/details?role=caregiver"
            className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-tertiary transition group-hover:translate-x-0.5"
          >
            Get Started
            <span aria-hidden="true">→</span>
          </Link>
        </article>
      </div>

      <p className="mt-8 text-center text-sm text-secondary">
        Already have a GrandCure account?{" "}
        <Link href="/login" className="font-bold text-primary hover:text-blue-700">
          Sign In
        </Link>
      </p>
    </div>
  );
}
