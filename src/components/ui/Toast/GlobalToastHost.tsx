"use client";

import { CheckCircle2, CircleAlert, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type ToastTone = "success" | "error";

type ToastMessage = {
  id: number;
  message: string;
  tone: ToastTone;
};

type ToastEventDetail = {
  message?: string;
  tone?: ToastTone;
};

const TOAST_TIMEOUT_MS = 3200;

export function GlobalToastHost() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const nextIdRef = useRef(1);

  useEffect(() => {
    function pushToast(detail: ToastEventDetail) {
      if (!detail.message) {
        return;
      }

      const id = nextIdRef.current;
      nextIdRef.current += 1;

      const nextToast: ToastMessage = {
        id,
        message: detail.message,
        tone: detail.tone === "error" ? "error" : "success",
      };

      setToasts((current) => [...current.slice(-2), nextToast]);

      window.setTimeout(() => {
        setToasts((current) => current.filter((toast) => toast.id !== id));
      }, TOAST_TIMEOUT_MS);
    }

    function handleToast(event: Event) {
      const customEvent = event as CustomEvent<ToastEventDetail>;
      pushToast(customEvent.detail ?? {});
    }

    window.addEventListener("gc:toast", handleToast as EventListener);

    return () => {
      window.removeEventListener("gc:toast", handleToast as EventListener);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-100 flex w-[min(92vw,26rem)] flex-col gap-2 sm:bottom-6 sm:right-6">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role={toast.tone === "error" ? "alert" : "status"}
          aria-live={toast.tone === "error" ? "assertive" : "polite"}
          className={[
            "pointer-events-auto flex items-start gap-3 rounded-2xl border px-4 py-3 shadow-xl backdrop-blur",
            toast.tone === "success"
              ? "border-emerald-200 bg-emerald-50/95 text-emerald-900"
              : "border-rose-200 bg-rose-50/95 text-rose-900",
          ].join(" ")}
        >
          <span className="mt-0.5 shrink-0">
            {toast.tone === "success" ? (
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            ) : (
              <CircleAlert className="h-4 w-4" aria-hidden="true" />
            )}
          </span>

          <p className="min-w-0 flex-1 text-sm font-semibold">{toast.message}</p>

          <button
            type="button"
            onClick={() => {
              setToasts((current) => current.filter((item) => item.id !== toast.id));
            }}
            className="inline-flex h-6 w-6 items-center justify-center rounded-full transition hover:bg-black/5"
            aria-label="Dismiss notification"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      ))}
    </div>
  );
}
