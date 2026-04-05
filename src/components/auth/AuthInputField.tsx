import type { ReactNode } from "react";

import { Input } from "@/components/ui/Input/Input";
import { cn } from "@/lib/utils";

type AuthInputFieldProps = {
  id: string;
  name?: string;
  label: string;
  type?: "text" | "email" | "password";
  autoComplete?: string;
  placeholder?: string;
  leftIcon?: ReactNode;
  rightSlot?: ReactNode;
  labelRightSlot?: ReactNode;
  className?: string;
};

export function AuthInputField({
  id,
  name,
  label,
  type = "text",
  autoComplete,
  placeholder,
  leftIcon,
  rightSlot,
  labelRightSlot,
  className,
}: AuthInputFieldProps) {
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

      <div className="flex h-12 items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-100 px-4 transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
        {leftIcon}
        <Input
          id={id}
          name={name ?? id}
          type={type}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className={cn(
            "h-full w-full bg-transparent text-sm text-zinc-900 placeholder:text-zinc-500 outline-none",
            className,
          )}
        />
        {rightSlot}
      </div>
    </div>
  );
}
