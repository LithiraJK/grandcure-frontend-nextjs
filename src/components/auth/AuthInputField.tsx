import type { InputHTMLAttributes, ReactNode } from "react";

import { Input } from "@/components/ui/Input/Input";
import { cn } from "@/lib/utils";

type AuthInputFieldProps = {
  id: string;
  label: string;
  leftIcon?: ReactNode;
  rightSlot?: ReactNode;
  labelRightSlot?: ReactNode;
  className?: string;
  error?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "className">;

export function AuthInputField({
  id,
  label,
  leftIcon,
  rightSlot,
  labelRightSlot,
  className,
  error,
  ...inputProps
}: AuthInputFieldProps) {
  const errorId = `${id}-error`;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-800"
        >
          {label}
        </label>
        {labelRightSlot}
      </div>

      <div
        className={cn(
          "flex h-12 items-center gap-3 rounded-2xl border bg-zinc-100 px-4 transition focus-within:ring-2",
          error
            ? "border-red-300 focus-within:border-red-400 focus-within:ring-red-200"
            : "border-zinc-200 focus-within:border-primary focus-within:ring-primary/20",
        )}
      >
        {leftIcon}
        <Input
          id={id}
          name={inputProps.name ?? id}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "h-full w-full bg-transparent text-sm text-zinc-900 placeholder:text-zinc-500 outline-none",
            className,
          )}
          {...inputProps}
        />
        {rightSlot}
      </div>

      {error ? (
        <p id={errorId} className="text-xs font-medium text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
