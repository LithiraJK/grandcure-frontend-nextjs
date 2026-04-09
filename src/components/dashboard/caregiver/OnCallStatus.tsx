"use client";

import { useAuthStore } from "@/store/useAuthStore";

export function OnCallStatus() {
  const isAvailable = useAuthStore((state) => state.user?.isAvailable ?? true);
  const isAvailabilityLoading = useAuthStore((state) => state.isAvailabilityLoading);
  const toggleAvailability = useAuthStore((state) => state.toggleAvailability);

  return (
    <section className="rounded-3xl border border-[#d8e4ee] bg-white p-5 shadow-soft sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-zinc-900">
            On-Call Status
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-secondary sm:text-base">
            Stay available to receive nearby urgent patient requests. High-priority alerts
            trigger a fast response workflow.
          </p>
        </div>

        <div className="flex flex-col items-start gap-3 sm:items-end">
          <button
            type="button"
            role="switch"
            aria-checked={isAvailable}
            aria-busy={isAvailabilityLoading}
            disabled={isAvailabilityLoading}
            onClick={() => {
              void toggleAvailability();
            }}
            className="group inline-flex h-11 w-20 items-center rounded-full bg-zinc-200 p-1 transition data-[state=on]:bg-primary disabled:cursor-not-allowed disabled:opacity-70"
            data-state={isAvailable ? "on" : "off"}
          >
            <span
              className="h-9 w-9 rounded-full bg-white shadow-sm transition-transform group-data-[state=on]:translate-x-9"
              aria-hidden="true"
            />
          </button>

          <p
            className={[
              "text-xs font-bold uppercase tracking-[0.12em]",
              isAvailable ? "text-tertiary" : "text-zinc-500",
            ].join(" ")}
          >
            {isAvailabilityLoading
              ? "Updating Availability..."
              : isAvailable
                ? "Currently Accepting Offers"
                : "Currently Unavailable"}
          </p>
        </div>
      </div>
    </section>
  );
}
