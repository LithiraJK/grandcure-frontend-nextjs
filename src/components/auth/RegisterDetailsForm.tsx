"use client";

import { useState, type FormEvent } from "react";

import { AuthFormMessage } from "@/components/auth/AuthFormMessage";
import { AuthInputField } from "@/components/auth/AuthInputField";
import { AuthPrimaryButton } from "@/components/auth/AuthPrimaryButton";
import { PasswordToggleButton } from "@/components/auth/PasswordToggleButton";
import { usePasswordVisibility } from "@/hooks/usePasswordVisibility";
import { validateRegister, type RegisterFormValues } from "@/lib/authValidation";

export function RegisterDetailsForm() {
  const [formValues, setFormValues] = useState<RegisterFormValues>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof RegisterFormValues, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const passwordVisibility = usePasswordVisibility();
  const confirmPasswordVisibility = usePasswordVisibility();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validateRegister(formValues);
    setErrors(nextErrors);
    setFormMessage(null);

    if (Object.keys(nextErrors).length > 0) {
      setFormMessage("Please fix the highlighted fields and try again.");
      return;
    }

    setIsSubmitting(true);

    // Placeholder for auth integration.
    await new Promise((resolve) => setTimeout(resolve, 700));
    console.log("Register submit", formValues);
    setFormMessage("Account created successfully. Taking you to onboarding...");
    setIsSubmitting(false);
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

      <AuthPrimaryButton type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
        {isSubmitting ? "Creating Account..." : "Create Account"}
        <span aria-hidden="true">→</span>
      </AuthPrimaryButton>
    </form>
  );
}
