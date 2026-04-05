"use client";

import { useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

import { AuthFormMessage } from "@/components/auth/AuthFormMessage";
import { AuthInputField } from "@/components/auth/AuthInputField";
import { AuthPrimaryButton } from "@/components/auth/AuthPrimaryButton";
import { PasswordToggleButton } from "@/components/auth/PasswordToggleButton";
import { usePasswordVisibility } from "@/hooks/usePasswordVisibility";
import { validateRegister, type RegisterFormValues } from "@/lib/authValidation";
import { ROUTES } from "@/lib/routes";
import type { ApiUserRole } from "@/services/auth.service";
import { useAuthStore } from "@/store/useAuthStore";

export function RegisterDetailsForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formValues, setFormValues] = useState<RegisterFormValues>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof RegisterFormValues, string>>
  >({});
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const passwordVisibility = usePasswordVisibility();
  const confirmPasswordVisibility = usePasswordVisibility();
  const register = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);
  const authError = useAuthStore((state) => state.error);

  const selectedRole = searchParams.get("role") === "caregiver" ? "caregiver" : "patient";
  const selectedRoleLabel = selectedRole === "caregiver" ? "Caregiver" : "Patient";
  const selectedApiRole: ApiUserRole = selectedRole === "caregiver" ? "CARE_GIVER" : "PATIENT";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validateRegister(formValues);
    setErrors(nextErrors);
    setFormMessage(null);

    if (Object.keys(nextErrors).length > 0) {
      setFormMessage("Please fix the highlighted fields and try again.");
      return;
    }

    try {
      await register({
        name: formValues.name,
        email: formValues.email,
        password: formValues.password,
        role: selectedApiRole,
      });

      router.push(`${ROUTES.login}?registered=1`);
      return;
    } catch (error) {
      setFormMessage(
        error instanceof Error
          ? error.message
          : authError ?? "Could not create your account. Please try again.",
      );
    }
  };

  const updateField = <K extends keyof RegisterFormValues>(
    field: K,
    value: RegisterFormValues[K],
  ) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setFormMessage(null);
  };

  return (
    <form
      className="space-y-5"
      aria-label="Registration details form"
      onSubmit={handleSubmit}
      noValidate
    >
      <p className="rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-primary">
        Registering as {selectedRoleLabel}
      </p>

      <input type="hidden" name="role" value={selectedRole} />

      <AuthInputField
        id="name"
        name="name"
        type="text"
        autoComplete="name"
        label="Full Name"
        placeholder="Jane Doe"
        value={formValues.name}
        onChange={(event) => updateField("name", event.target.value)}
        error={errors.name}
      />

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
      />

      <AuthInputField
        id="password"
        name="password"
        type={passwordVisibility.inputType}
        autoComplete="new-password"
        label="Password"
        placeholder="Create a secure password"
        value={formValues.password}
        onChange={(event) => updateField("password", event.target.value)}
        error={errors.password}
        rightSlot={
          <PasswordToggleButton
            isVisible={passwordVisibility.isVisible}
            ariaLabel={passwordVisibility.ariaLabel}
            onToggle={passwordVisibility.toggleVisibility}
          />
        }
      />

      <AuthInputField
        id="confirmPassword"
        name="confirmPassword"
        type={confirmPasswordVisibility.inputType}
        autoComplete="new-password"
        label="Confirm Password"
        placeholder="Re-enter your password"
        value={formValues.confirmPassword}
        onChange={(event) => updateField("confirmPassword", event.target.value)}
        error={errors.confirmPassword}
        rightSlot={
          <PasswordToggleButton
            isVisible={confirmPasswordVisibility.isVisible}
            ariaLabel={confirmPasswordVisibility.ariaLabel}
            onToggle={confirmPasswordVisibility.toggleVisibility}
          />
        }
      />

      {formMessage ? (
        <AuthFormMessage
          message={formMessage}
          tone={Object.keys(errors).length > 0 ? "error" : "success"}
        />
      ) : null}

      <AuthPrimaryButton type="submit" disabled={isLoading} aria-busy={isLoading}>
        {isLoading ? "Creating Account..." : "Create Account"}
        <span aria-hidden="true">→</span>
      </AuthPrimaryButton>
    </form>
  );
}
