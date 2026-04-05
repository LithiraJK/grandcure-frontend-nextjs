"use client";

import { AuthInputField } from "@/components/auth/AuthInputField";
import { AuthPrimaryButton } from "@/components/auth/AuthPrimaryButton";
import { PasswordToggleButton } from "@/components/auth/PasswordToggleButton";
import { usePasswordVisibility } from "@/hooks/usePasswordVisibility";

export function RegisterDetailsForm() {
  const passwordVisibility = usePasswordVisibility();
  const confirmPasswordVisibility = usePasswordVisibility();

  return (
    <form className="space-y-5" aria-label="Registration details form">
      <AuthInputField
        id="name"
        name="name"
        type="text"
        autoComplete="name"
        label="Full Name"
        placeholder="Jane Doe"
      />

      <AuthInputField
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        label="Work Email"
        placeholder="name@grandcure.com"
      />

      <AuthInputField
        id="password"
        name="password"
        type={passwordVisibility.inputType}
        autoComplete="new-password"
        label="Password"
        placeholder="Create a secure password"
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
        rightSlot={
          <PasswordToggleButton
            isVisible={confirmPasswordVisibility.isVisible}
            ariaLabel={confirmPasswordVisibility.ariaLabel}
            onToggle={confirmPasswordVisibility.toggleVisibility}
          />
        }
      />

      <AuthPrimaryButton type="submit">
        Create Account
        <span aria-hidden="true">→</span>
      </AuthPrimaryButton>
    </form>
  );
}
