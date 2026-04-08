import { Activity, ShieldAlert, UsersRound } from "lucide-react";

type AdminStatsValues = {
  totalUsers: number;
  pendingVerifications: number;
  activeAssignments: number;
};

type AdminStatsProps = {
  stats?: Partial<AdminStatsValues>;
};

const defaultStats: AdminStatsValues = {
  totalUsers: 1248,
  pendingVerifications: 32,
  activeAssignments: 186,
};

function formatMetric(value: number) {
  return value.toLocaleString("en-US");
}

export function AdminStats({ stats }: AdminStatsProps) {
  const resolvedStats: AdminStatsValues = {
    totalUsers: stats?.totalUsers ?? defaultStats.totalUsers,
    pendingVerifications:
      stats?.pendingVerifications ?? defaultStats.pendingVerifications,
    activeAssignments: stats?.activeAssignments ?? defaultStats.activeAssignments,
  };

  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-3" aria-label="Admin key metrics">
      <article className="rounded-3xl border border-[#d8e4ee] bg-white p-5 shadow-soft sm:p-6">
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <UsersRound className="h-5 w-5" />
        </div>
        <p className="mt-4 text-xs font-bold uppercase tracking-[0.12em] text-secondary">
          Total Users
        </p>
        <p className="mt-2 font-display text-4xl font-extrabold tracking-tight text-zinc-900">
          {formatMetric(resolvedStats.totalUsers)}
        </p>
        <p className="mt-1 text-sm text-secondary">Patients and caregivers on platform</p>
      </article>

      <article className="rounded-3xl border border-amber-200 bg-amber-50 p-5 shadow-soft sm:p-6">
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
          <ShieldAlert className="h-5 w-5" />
        </div>
        <p className="mt-4 text-xs font-bold uppercase tracking-[0.12em] text-amber-800">
          Pending Verifications
        </p>
        <p className="mt-2 font-display text-4xl font-extrabold tracking-tight text-amber-900">
          {formatMetric(resolvedStats.pendingVerifications)}
        </p>
        <p className="mt-1 text-sm text-amber-800">Requires review from admin team</p>
      </article>

      <article className="rounded-3xl border border-[#d8e4ee] bg-white p-5 shadow-soft sm:p-6">
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#dff5f8] text-[#0f5b73]">
          <Activity className="h-5 w-5" />
        </div>
        <p className="mt-4 text-xs font-bold uppercase tracking-[0.12em] text-secondary">
          Active Assignments
        </p>
        <p className="mt-2 font-display text-4xl font-extrabold tracking-tight text-zinc-900">
          {formatMetric(resolvedStats.activeAssignments)}
        </p>
        <p className="mt-1 text-sm text-secondary">Open care requests currently in motion</p>
      </article>
    </section>
  );
}
