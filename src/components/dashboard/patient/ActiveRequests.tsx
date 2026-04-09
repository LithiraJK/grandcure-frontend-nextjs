"use client";

import { Loader2, MapPin, Sparkles } from "lucide-react";
import { useEffect, useMemo } from "react";

import { type Assignment, useAssignmentStore } from "@/store/useAssignmentStore";

type StatusMeta = {
  label: string;
  badgeClassName: string;
};

const ACTIVE_STATUSES = new Set(["PENDING", "ACCEPTED", "IN_PROGRESS"]);

function resolveStatusMeta(status: Assignment["status"]): StatusMeta {
  if (status === "ACCEPTED") {
    return {
      label: "Caregiver assigned and preparing",
      badgeClassName: "bg-cyan-100/80 text-cyan-800",
    };
  }

  if (status === "IN_PROGRESS") {
    return {
      label: "Caregiver on the way",
      badgeClassName: "bg-emerald-100/80 text-emerald-800",
    };
  }

  return {
    label: "Looking for caregivers...",
    badgeClassName: "bg-amber-100/80 text-amber-800",
  };
}

function formatCurrency(value: number) {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
}

export function ActiveRequests() {
  const isLoading = useAssignmentStore((state) => state.isLoading);
  const patientAssignments = useAssignmentStore((state) => state.patientAssignments);
  const fetchPatientAssignments = useAssignmentStore((state) => state.fetchPatientAssignments);
  const cancelAssignment = useAssignmentStore((state) => state.cancelAssignment);

  useEffect(() => {
    void fetchPatientAssignments();
  }, [fetchPatientAssignments]);

  const activeRequests = useMemo(
    () =>
      patientAssignments.filter((assignment) => ACTIVE_STATUSES.has(assignment.status)),
    [patientAssignments],
  );

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-3xl font-extrabold tracking-tight text-zinc-900">
          Active Requests
        </h2>
        <span className="inline-flex items-center gap-1 rounded-full bg-[#ecf5fb] px-3 py-1 text-xs font-bold text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          {activeRequests.length} ongoing
        </span>
      </div>

      {isLoading ? (
        <div className="inline-flex items-center gap-2 rounded-2xl bg-white/90 px-4 py-3 text-sm text-secondary shadow-soft">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading active requests...
        </div>
      ) : activeRequests.length === 0 ? (
        <div className="rounded-3xl bg-white/90 p-6 text-sm text-secondary shadow-soft">
          No active requests right now.
        </div>
      ) : (
        <div className="grid gap-4">
          {activeRequests.map((assignment) => {
            const statusMeta = resolveStatusMeta(assignment.status);

            return (
              <article
                key={assignment.id}
                className="rounded-3xl bg-white/90 p-5 shadow-soft sm:p-6"
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
                      statusMeta.badgeClassName,
                    ].join(" ")}
                  >
                    {statusMeta.label}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-zinc-700">
                  <p className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-primary" />
                    {assignment.address}
                  </p>
                  <p className="font-semibold">{assignment.etaLabel}</p>
                  <p className="font-extrabold text-zinc-900">{formatCurrency(assignment.fee)}</p>
                </div>

                {assignment.status === "PENDING" ? (
                  <div className="mt-5">
                    <button
                      type="button"
                      onClick={() => {
                        void cancelAssignment(assignment.id);
                      }}
                      className="inline-flex h-10 items-center rounded-full bg-rose-50 px-4 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
                    >
                      Cancel Request
                    </button>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
