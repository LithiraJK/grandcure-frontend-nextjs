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
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
        <circle cx="12" cy="12" r="3" />
        {isVisible ? null : <path d="M3 3l18 18" />}
      </svg>
    </button>
  );
}
