type AuthFormMessageProps = {
  message: string;
  tone?: "success" | "error";
};

export function AuthFormMessage({ message, tone = "success" }: AuthFormMessageProps) {
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={
        tone === "error"
          ? "rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700"
          : "rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700"
      }
    >
      {message}
    </p>
  );
}
