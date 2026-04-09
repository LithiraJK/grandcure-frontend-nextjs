import { Clock3 } from "lucide-react";

import { type Assignment } from "@/store/useAssignmentStore";

type StandardRequestCardProps = {
  assignment: Assignment;
  onViewDetails?: (assignmentId: string) => void;
};

function formatCurrency(value: number) {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
}

export function StandardRequestCard({ assignment, onViewDetails }: StandardRequestCardProps) {
  return (
    <article className="rounded-3xl border border-[#d8e4ee] bg-white p-5 shadow-soft sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <span
          className={[
            "inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest",
            assignment.priority === "RECURRING"
              ? "bg-tertiary/10 text-tertiary"
              : "bg-cyan-100 text-[#0f5b73]",
          ].join(" ")}
        >
          {assignment.priority === "RECURRING" ? "Recurring" : "Standard Visit"}
        </span>

        <p className="text-xs font-semibold text-secondary">{assignment.createdAtLabel}</p>
      </div>

      <h3 className="mt-4 font-display text-2xl font-extrabold tracking-tight text-zinc-900">
        {assignment.title}
      </h3>

      <p className="mt-2 text-sm text-secondary">
        {assignment.patientName} • {assignment.distanceMiles} miles away • {assignment.etaLabel}
      </p>

      <div className="mt-5 flex items-center justify-between gap-3">
        <p className="inline-flex items-center gap-1 text-sm font-semibold text-secondary">
          <Clock3 className="h-4 w-4 text-primary" />
          {assignment.status}
        </p>

        <p className="text-lg font-extrabold text-primary">{formatCurrency(assignment.fee)}</p>
      </div>

      <button
        type="button"
        onClick={() => onViewDetails?.(assignment.id)}
        className="mt-5 inline-flex h-10 items-center rounded-full border border-primary/20 bg-[#edf4fa] px-4 text-sm font-semibold text-primary transition hover:bg-[#dbeaf7]"
      >
        View Details
      </button>
    </article>
  );
}
