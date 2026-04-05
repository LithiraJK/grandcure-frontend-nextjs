export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-neutral px-5 py-10 sm:px-8">
      <section className="mx-auto max-w-3xl rounded-4xl border border-zinc-200/80 bg-white p-8 shadow-soft sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-secondary">GrandCure Dashboard</p>
        <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
          Welcome to Dashboard
        </h1>
        <p className="mt-3 text-base leading-relaxed text-secondary">
          Login integration is now connected to backend auth via Zustand store.
        </p>
      </section>
    </main>
  );
}
