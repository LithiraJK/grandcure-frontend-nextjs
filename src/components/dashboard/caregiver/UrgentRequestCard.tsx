"use client";

import { AlertTriangle, Clock3, MapPin, Timer } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { type Assignment, useAssignmentStore } from "@/store/useAssignmentStore";

type UrgentRequestCardProps = {
  assignment: Assignment;
  initialCountdownSeconds?: number;
};

function formatCountdown(secondsLeft: number) {
  const minutes = Math.floor(secondsLeft / 60)
    .toString()
    .padStart(1, "0");
  const seconds = (secondsLeft % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function UrgentRequestCard({
  assignment,
  initialCountdownSeconds = 60,
}: UrgentRequestCardProps) {
  const acceptAssignment = useAssignmentStore((state) => state.acceptAssignment);
  const rejectAssignment = useAssignmentStore((state) => state.rejectAssignment);
  const [secondsLeft, setSecondsLeft] = useState(initialCountdownSeconds);

  useEffect(() => {
    if (secondsLeft <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [secondsLeft]);

  const countdownProgress = useMemo(() => {
    if (initialCountdownSeconds <= 0) {
      return 0;
    }

    return Math.max(0, (secondsLeft / initialCountdownSeconds) * 100);
  }, [initialCountdownSeconds, secondsLeft]);

  return (
    <article className="rounded-3xl border border-red-200 bg-[#fdecec] p-5 shadow-soft sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="inline-flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm font-black uppercase tracking-[0.12em]">Urgent Request</span>
          </p>
          <h3 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-red-700">
            {assignment.title}
          </h3>
          <p className="mt-1 text-sm text-red-700/80">
            Patient: {assignment.patientName} ({assignment.patientAge}y) • {assignment.distanceMiles} miles away
          </p>
        </div>

        <div className="rounded-full bg-red-600 px-4 py-2 text-white">
          <p className="inline-flex items-center gap-2 text-sm font-bold">
            <Timer className="h-4 w-4" />
            {formatCountdown(secondsLeft)}
          </p>
        </div>
      </div>

      <div className="mt-4 h-2 w-full rounded-full bg-red-100">
        <div
          className="h-full rounded-full bg-red-500 transition-[width] duration-1000"
          style={{ width: `${countdownProgress}%` }}
        />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-white/85 p-4">
          <p className="text-[11px] font-bold uppercase tracking-widest text-secondary">Address</p>
          <p className="mt-2 inline-flex items-start gap-2 text-sm text-zinc-800">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            {assignment.address}
          </p>
        </div>

        <div className="rounded-2xl bg-white/85 p-4">
          <p className="text-[11px] font-bold uppercase tracking-widest text-secondary">Note</p>
          <p className="mt-2 text-sm text-zinc-800">{assignment.note}</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-2 text-xs font-semibold text-secondary">
          <Clock3 className="h-3.5 w-3.5" />
          {assignment.etaLabel}
        </span>

        <button
          type="button"
          onClick={() => acceptAssignment(assignment.id)}
          className="inline-flex h-11 items-center rounded-full bg-primary px-6 text-sm font-bold text-white transition hover:bg-[#004d80]"
        >
          Accept Request
        </button>

        <button
          type="button"
          onClick={() => rejectAssignment(assignment.id)}
          className="inline-flex h-11 items-center rounded-full border border-zinc-300 bg-white px-6 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100"
        >
          Reject
        </button>
      </div>
    </article>
  );
}
