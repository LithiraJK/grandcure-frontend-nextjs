import { Suspense } from "react";

import { RegisterDetailsForm } from "@/components/auth/RegisterDetailsForm";

export default function RegisterDetailsPage() {
  return (
    <div className="mx-auto w-full max-w-xl rounded-[2.25rem] border border-[#e3e8ef] bg-[#f8fafc]/96 p-6 shadow-[0_32px_70px_-46px_rgba(20,38,54,0.62)] sm:p-8 md:p-9">
      <div className="mb-6 flex items-center gap-4 sm:mb-8">
        <div className="h-1.5 w-16 rounded-full bg-[#0b6c2f]" />
        <div className="h-1.5 w-16 rounded-full bg-[#1a6aa0]" />
        <p className="text-xs font-semibold text-[#7a838e] sm:text-sm">
          Step 2 of 2
        </p>
      </div>

      <div className="mb-6 space-y-2 sm:mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight text-[#23282d] sm:text-[2.15rem]">
          Complete your registration
        </h1>
        <p className="text-sm leading-relaxed text-[#6b7580] sm:text-base">
          Set up your secure GrandCure account to begin your healthcare journey.
        </p>
      </div>

      <Suspense fallback={<div className="h-80 animate-pulse rounded-3xl bg-zinc-100" />}>
        <RegisterDetailsForm />
      </Suspense>
    </div>
  );
}
