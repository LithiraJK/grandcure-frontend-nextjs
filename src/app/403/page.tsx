export default function ForbiddenPage() {
  return (
    <main className="min-h-screen bg-neutral px-4 py-10 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-2xl rounded-3xl border border-zinc-200 bg-white p-8 shadow-soft">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-red-600">403</p>
        <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-zinc-900">
          Access denied
        </h1>
        <p className="mt-3 text-sm text-secondary">
          You are authenticated, but your account role does not have permission to view this page.
        </p>
      </section>
    </main>
  );
}
