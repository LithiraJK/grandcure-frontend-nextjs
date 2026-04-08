export type AdminAssignment = {
  id: string;
  date: string;
  patientName: string;
  caregiverName: string;
  serviceType: string;
  status: "PENDING" | "ACCEPTED" | "COMPLETED" | string;
};

type AssignmentsTableProps = {
  assignments?: AdminAssignment[];
};

const mockAssignments: AdminAssignment[] = [
  {
    id: "asg-2001",
    date: "2026-04-08",
    patientName: "Evelyn Davis",
    caregiverName: "Sarah Mitchell",
    serviceType: "Medication Reminder",
    status: "PENDING",
  },
  {
    id: "asg-2002",
    date: "2026-04-08",
    patientName: "James Cooper",
    caregiverName: "Nina Carter",
    serviceType: "Physical Therapy",
    status: "ACCEPTED",
  },
  {
    id: "asg-2003",
    date: "2026-04-07",
    patientName: "Robert Lee",
    caregiverName: "Amara Jones",
    serviceType: "Post-Op Monitoring",
    status: "COMPLETED",
  },
];

function getStatusBadgeClass(status: string) {
  const normalized = status.toUpperCase();

  if (normalized === "COMPLETED") {
    return "bg-tertiary/10 text-tertiary";
  }

  if (normalized === "ACCEPTED") {
    return "bg-[#dff5f8] text-[#0f5b73]";
  }

  return "bg-amber-100 text-amber-700";
}

function formatStatusLabel(status: string) {
  return status.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

export function AssignmentsTable({ assignments }: AssignmentsTableProps) {
  const rows = assignments && assignments.length > 0 ? assignments : mockAssignments;

  return (
    <section className="overflow-hidden rounded-3xl border border-[#d8e4ee] bg-white shadow-soft">
      <div className="overflow-x-auto">
        <table className="min-w-190 w-full border-separate border-spacing-0">
          <thead>
            <tr className="bg-[#f4f8fc] text-left">
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-secondary">Date</th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-secondary">Patient Name</th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-secondary">Caregiver Name</th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-secondary">Service Type</th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-secondary">Status</th>
            </tr>
          </thead>

          <tbody>
            {rows.length > 0 ? (
              rows.map((assignment) => (
                <tr key={assignment.id} className="border-t border-zinc-100 text-sm text-zinc-800">
                  <td className="px-4 py-4 text-secondary">{assignment.date}</td>
                  <td className="px-4 py-4 font-semibold text-zinc-900">{assignment.patientName}</td>
                  <td className="px-4 py-4 text-zinc-800">{assignment.caregiverName}</td>
                  <td className="px-4 py-4 text-secondary">{assignment.serviceType}</td>
                  <td className="px-4 py-4">
                    <span
                      className={[
                        "inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold",
                        getStatusBadgeClass(assignment.status),
                      ].join(" ")}
                    >
                      {formatStatusLabel(assignment.status)}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-sm text-secondary">
                  No assignments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
