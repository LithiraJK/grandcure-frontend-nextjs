import type { ButtonHTMLAttributes, ReactNode } from "react";

import { Button } from "@/components/ui/Button/Button";
import { cn } from "@/lib/utils";

type AuthPrimaryButtonProps = {
  children: ReactNode;
  className?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

export function AuthPrimaryButton({
  children,
  type = "button",
  className,
  ...buttonProps
}: AuthPrimaryButtonProps) {
  return (
    <Button
      type={type}
      {...buttonProps}
      className={cn(
        "inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 font-semibold text-white shadow-soft transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:brightness-100",
        className,
      )}
    >
      {children}
    </Button>
  );
}
