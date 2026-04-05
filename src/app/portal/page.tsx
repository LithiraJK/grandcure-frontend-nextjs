type PortalPageProps = {
  searchParams: Promise<{
    role?: string;
  }>;
};

export default async function PortalPage({ searchParams }: PortalPageProps) {
  const params = await searchParams;
  const role = params.role === "caregiver" ? "Caregiver" : params.role === "patient" ? "Patient" : "Member";

  return (
    <main className="min-h-screen bg-neutral px-5 py-10 sm:px-8">
      <section className="mx-auto max-w-3xl rounded-4xl border border-zinc-200/80 bg-white p-8 shadow-soft sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-secondary">GrandCure Portal</p>
        <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
          Welcome to your dashboard
        </h1>
        <p className="mt-3 text-base leading-relaxed text-secondary">
          Signed in as <span className="font-semibold text-zinc-900">{role}</span>. This is a placeholder destination for the authenticated area.
        </p>
      </section>
    </main>
  );
}
