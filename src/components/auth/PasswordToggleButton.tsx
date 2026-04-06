import { Eye, EyeOff } from "lucide-react";

type PasswordToggleButtonProps = {
  isVisible: boolean;
  ariaLabel: string;
  onToggle: () => void;
};

export function PasswordToggleButton({
  isVisible,
  ariaLabel,
  onToggle,
}: PasswordToggleButtonProps) {
  return (
    <button
      type="button"
      className="text-secondary transition hover:text-zinc-700"
      aria-label={ariaLabel}
      onClick={onToggle}
    >
      {isVisible ? (
        <Eye aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
      ) : (
        <EyeOff aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
      )}
    </button>
  );
}
