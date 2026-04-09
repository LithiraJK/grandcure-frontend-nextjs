"use client";

import { CalendarClock, UserRound } from "lucide-react";
import { useMemo } from "react";

import { useAssignmentStore } from "@/store/useAssignmentStore";

const HISTORY_STATUSES = new Set(["COMPLETED", "CANCELLED"]);

function resolveHistoryStatusMeta(status: string) {
  if (status === "COMPLETED") {
    return {
      label: "Completed",
      className: "bg-emerald-100/80 text-emerald-800",
    };
  }

  return {
    label: "Cancelled",
    className: "bg-zinc-200/80 text-zinc-700",
  };
}

export function PatientHistory() {
  const patientAssignments = useAssignmentStore((state) => state.patientAssignments);

  const historyAssignments = useMemo(
    () =>
      patientAssignments.filter((assignment) => HISTORY_STATUSES.has(assignment.status)),
    [patientAssignments],
  );

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-3xl font-extrabold tracking-tight text-zinc-900">
          Service History
        </h2>
        <p className="text-sm font-semibold text-secondary">
          {historyAssignments.length} records
        </p>
      </div>

      {historyAssignments.length === 0 ? (
        <div className="rounded-3xl bg-white/90 p-6 text-sm text-secondary shadow-soft">
          No completed or cancelled services yet.
        </div>
      ) : (
        <div className="grid gap-3">
          {historyAssignments.map((assignment) => {
            const statusMeta = resolveHistoryStatusMeta(assignment.status);
            const caregiverName = assignment.patientName?.trim() || "Not assigned";

            return (
              <article
                key={assignment.id}
                className="rounded-3xl bg-white/90 px-5 py-4 shadow-soft"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-2xl font-extrabold tracking-tight text-zinc-900">
                      {assignment.title}
                    </h3>
                    <p className="mt-1 text-sm text-secondary">{assignment.note}</p>
                  </div>

                  <span
                    className={[
                      "inline-flex rounded-full px-3 py-1 text-xs font-bold",
                      statusMeta.className,
                    ].join(" ")}
                  >
                    {statusMeta.label}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-zinc-700">
                  <p className="inline-flex items-center gap-1.5">
                    <UserRound className="h-4 w-4 text-primary" />
                    Caregiver: {caregiverName}
                  </p>
                  <p className="inline-flex items-center gap-1.5">
                    <CalendarClock className="h-4 w-4 text-primary" />
                    {assignment.createdAtLabel}
                  </p>
                  <p className="font-semibold">Type: {assignment.priority}</p>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
