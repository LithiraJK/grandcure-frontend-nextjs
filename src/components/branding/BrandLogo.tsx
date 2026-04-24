import Link from "next/link";

import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  withDot?: boolean;
  href?: string;
  ariaLabel?: string;
};

export function BrandLogo({
  className,
  withDot = true,
  href = "/",
  ariaLabel = "GrandCure home",
}: BrandLogoProps) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={cn("font-display font-extrabold tracking-tight text-primary", className)}
    >
      GrandCure{withDot ? "." : ""}
    </Link>
  );
}