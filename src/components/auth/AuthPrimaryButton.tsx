import type { ReactNode } from "react";

import { Button } from "@/components/ui/Button/Button";
import { cn } from "@/lib/utils";

type AuthPrimaryButtonProps = {
  children: ReactNode;
  type?: "button" | "submit" | "reset";
  className?: string;
};

export function AuthPrimaryButton({
  children,
  type = "button",
  className,
}: AuthPrimaryButtonProps) {
  return (
    <Button
      type={type}
      className={cn(
        "inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 font-semibold text-white shadow-soft transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
        className,
      )}
    >
      {children}
    </Button>
  );
}
