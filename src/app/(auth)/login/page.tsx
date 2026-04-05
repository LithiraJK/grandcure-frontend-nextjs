"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";

import { AuthInputField } from "@/components/auth/AuthInputField";
import { AuthFormMessage } from "@/components/auth/AuthFormMessage";
import { AuthPrimaryButton } from "@/components/auth/AuthPrimaryButton";
import { PasswordToggleButton } from "@/components/auth/PasswordToggleButton";
import { establishAuthSession } from "@/lib/authSession";
import { usePasswordVisibility } from "@/hooks/usePasswordVisibility";
import { validateLogin, type LoginFormValues } from "@/lib/authValidation";
import { ROUTES } from "@/lib/routes";
import { useAuthStore } from "@/store/useAuthStore";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formValues, setFormValues] = useState<LoginFormValues>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormValues, string>>>({});
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const passwordVisibility = usePasswordVisibility();
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    if (searchParams.get("registered") === "1") {
      setFormMessage("Registration successful. Please sign in with your new account.");
    }
  }, [searchParams]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validateLogin(formValues);
    setErrors(nextErrors);
    setFormMessage(null);

    if (Object.keys(nextErrors).length > 0) {
      setFormMessage("Please fix the highlighted fields and try again.");
      return;
    }

    try {
      await login(formValues);
      await establishAuthSession("member", false);
      setFormMessage("Signed in successfully. Redirecting to your dashboard...");
      router.push(ROUTES.dashboard);
      return;
    } catch (error) {
      setFormMessage(
        error instanceof Error ? error.message : "Could not sign in. Please try again.",
      );
    }
  };

  const updateField = <K extends keyof LoginFormValues>(field: K, value: LoginFormValues[K]) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setFormMessage(null);
  };

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

      <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
        <AuthInputField
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          label="Work Email"
          placeholder="name@grandcure.com"
          value={formValues.email}
          onChange={(event) => updateField("email", event.target.value)}
          error={errors.email}
          leftIcon={
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
          }
        />

        <AuthInputField
          id="password"
          name="password"
          type={passwordVisibility.inputType}
          autoComplete="current-password"
          label="Password"
          placeholder="••••••••"
          value={formValues.password}
          onChange={(event) => updateField("password", event.target.value)}
          error={errors.password}
          labelRightSlot={
            <Link
              href="#"
              className="text-xs font-semibold text-primary transition hover:text-blue-700"
            >
              Forgot password?
            </Link>
          }
          leftIcon={
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
          }
          rightSlot={
            <PasswordToggleButton
              isVisible={passwordVisibility.isVisible}
              ariaLabel={passwordVisibility.ariaLabel}
              onToggle={passwordVisibility.toggleVisibility}
            />
          }
        />

        <label className="inline-flex items-center gap-2 pt-1 text-sm text-secondary">
          <input type="checkbox" className="h-4 w-4 rounded border-zinc-300 text-primary focus:ring-primary" />
          Remember this device
        </label>

        {formMessage ? (
          <AuthFormMessage
            message={formMessage}
            tone={Object.keys(errors).length > 0 ? "error" : "success"}
          />
        ) : null}

        <AuthPrimaryButton type="submit" disabled={isLoading} aria-busy={isLoading}>
          {isLoading ? "Signing In..." : "Sign In to Portal"}
          <span aria-hidden="true">→</span>
        </AuthPrimaryButton>
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
