import { RegisterDetailsForm } from "@/components/auth/RegisterDetailsForm";

export default function RegisterDetailsPage() {
  return (
    <div className="mx-auto w-full max-w-xl rounded-4xl border border-zinc-200/80 bg-white p-6 shadow-soft sm:p-8">
      <div className="mb-6 flex items-center gap-4 sm:mb-8">
        <div className="h-1.5 w-12 rounded-full bg-tertiary" />
        <div className="h-1.5 w-12 rounded-full bg-primary" />
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-secondary">
          Step 2 of 2
        </p>
      </div>

      <div className="mb-6 space-y-2 sm:mb-8">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-[2.15rem]">
          Complete your registration
        </h1>
        <p className="text-sm leading-relaxed text-secondary">
          Set up your secure GrandCure account to begin your healthcare journey.
        </p>
      </div>

      <RegisterDetailsForm />
    </div>
  );
}
