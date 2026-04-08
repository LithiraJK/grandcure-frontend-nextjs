export default function AdminPage() {
  return (
    <main className="min-h-screen bg-neutral px-4 py-10 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-5xl rounded-3xl border border-zinc-200 bg-white p-8 shadow-soft">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-primary">Admin Dashboard</p>
        <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-zinc-900">
          Admin Control Center
        </h1>
        <p className="mt-3 text-sm text-secondary">
          Role-based admin route is active. You can now build admin modules under this path.
        </p>
      </section>
    </main>
  );
}
