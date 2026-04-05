import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="mx-auto w-full max-w-md">
      <div className="space-y-2">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
          Welcome back
        </h1>
        <p className="text-sm leading-relaxed text-secondary">
          Enter your credentials to access the management portal.
        </p>
      </div>

      <form className="mt-8 space-y-5">
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-800"
          >
            Work Email
          </label>
          <div className="flex h-12 items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-100 px-4 transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-4 w-4 text-secondary"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 6h16" />
              <path d="M4 6v12h16V6" />
              <path d="m4 7 8 6 8-6" />
            </svg>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="name@grandcure.com"
              className="h-full w-full bg-transparent text-sm text-zinc-900 placeholder:text-zinc-500 outline-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-800"
            >
              Password
            </label>
            <Link
              href="#"
              className="text-xs font-semibold text-primary transition hover:text-blue-700"
            >
              Forgot password?
            </Link>
          </div>
          <div className="flex h-12 items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-100 px-4 transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-4 w-4 text-secondary"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="4" y="11" width="16" height="9" rx="2" />
              <path d="M8 11V8a4 4 0 1 1 8 0v3" />
            </svg>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className="h-full w-full bg-transparent text-sm text-zinc-900 placeholder:text-zinc-500 outline-none"
            />
            <button
              type="button"
              className="text-secondary transition hover:text-zinc-700"
              aria-label="Toggle password visibility"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
          </div>
        </div>

        <label className="inline-flex items-center gap-2 pt-1 text-sm text-secondary">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-zinc-300 text-primary focus:ring-primary"
          />
          Remember this device
        </label>

        <button
          type="submit"
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 font-semibold text-white shadow-soft transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
        >
          Sign In to Portal
          <span aria-hidden="true">→</span>
        </button>
      </form>

      <div className="mt-8">
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <span className="h-px w-full bg-zinc-200" />
          </div>
          <p className="relative mx-auto w-fit bg-white px-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-zinc-400">
            Or continue with
          </p>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-zinc-100 px-4 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-200"
          >
            <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-zinc-900 text-[10px] font-bold text-white">
              G
            </span>
            Google SSO
          </button>
          <button
            type="button"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-zinc-100 px-4 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-200"
          >
            <span aria-hidden="true">🏢</span>
            Enterprise
          </button>
        </div>
      </div>
    </div>
  );
}
