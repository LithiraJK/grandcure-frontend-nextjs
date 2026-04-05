export function RegisterDetailsForm() {
  return (
    <form className="space-y-5" aria-label="Registration details form">
      <div className="space-y-2">
        <label
          htmlFor="name"
          className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-800"
        >
          Full Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Jane Doe"
          className="h-12 w-full rounded-2xl border border-zinc-200 bg-zinc-100 px-4 text-sm text-zinc-900 placeholder:text-zinc-500 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="email"
          className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-800"
        >
          Work Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="name@grandcure.com"
          className="h-12 w-full rounded-2xl border border-zinc-200 bg-zinc-100 px-4 text-sm text-zinc-900 placeholder:text-zinc-500 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-800"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="Create a secure password"
          className="h-12 w-full rounded-2xl border border-zinc-200 bg-zinc-100 px-4 text-sm text-zinc-900 placeholder:text-zinc-500 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="confirmPassword"
          className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-800"
        >
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="Re-enter your password"
          className="h-12 w-full rounded-2xl border border-zinc-200 bg-zinc-100 px-4 text-sm text-zinc-900 placeholder:text-zinc-500 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <button
        type="submit"
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 font-semibold text-white shadow-soft transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
      >
        Create Account
        <span aria-hidden="true">→</span>
      </button>
    </form>
  );
}
