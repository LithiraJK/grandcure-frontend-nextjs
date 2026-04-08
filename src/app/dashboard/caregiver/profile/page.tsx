"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type ChangeEvent, type DragEvent, type FormEvent } from "react";

import { CaregiverShell } from "@/components/dashboard/caregiver/CaregiverShell";
import { ROUTES } from "@/lib/routes";
import { useAuthStore } from "@/store/useAuthStore";
import { useProfileStore } from "@/store/useProfileStore";

type FormState = {
  phoneNumber: string;
  dateOfBirth: string;
  address: string;
  designation: string;
  hourlyRate: string;
};

type ToastState = {
  message: string;
  tone: "success" | "error";
} | null;

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

const initialFormState: FormState = {
  phoneNumber: "",
  dateOfBirth: "",
  address: "",
  designation: "",
  hourlyRate: "",
};

function isCaregiverRole(role: string | undefined) {
  if (!role) {
    return false;
  }

  const normalized = role.toUpperCase();
  return normalized === "CARE_GIVER" || normalized === "CAREGIVER";
}

function toText(value: unknown) {
  return typeof value === "string" ? value : "";
}

function toNumberText(value: unknown) {
  if (typeof value === "number") {
    return String(value);
  }

  if (typeof value === "string") {
    return value;
  }

  return "";
}

function normalizeDateForInput(value: unknown) {
  if (typeof value !== "string" || !value.trim()) {
    return "";
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  const year = parsed.getUTCFullYear();
  const month = String(parsed.getUTCMonth() + 1).padStart(2, "0");
  const day = String(parsed.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function validateFile(file: File): string | null {
  if (!ALLOWED_TYPES.has(file.type)) {
    return "Only .jpg, .png, or .webp files are allowed.";
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return "File size must be 5MB or less.";
  }

  return null;
}

export default function CaregiverProfileUpdatePage() {
  const router = useRouter();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const userRole = useAuthStore((state) => state.user?.role);

  const profile = useProfileStore((state) => state.profile);
  const isLoading = useProfileStore((state) => state.isLoading);
  const fetchProfile = useProfileStore((state) => state.fetchProfile);
  const updateCaregiverProfile = useProfileStore((state) => state.updateCaregiverProfile);

  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [idFile, setIdFile] = useState<File | null>(null);
  const [certFile, setCertFile] = useState<File | null>(null);
  const [activeDropZone, setActiveDropZone] = useState<"id" | "cert" | null>(null);
  const [toast, setToast] = useState<ToastState>(null);

  useEffect(() => {
    if (!isAuthenticated || !isCaregiverRole(userRole)) {
      router.replace(ROUTES.login);
      return;
    }

    void fetchProfile();
  }, [fetchProfile, isAuthenticated, router, userRole]);

  useEffect(() => {
    if (!profile) {
      return;
    }

    const source = profile as Record<string, unknown>;

    setFormState({
      phoneNumber: toText(source.phoneNumber),
      dateOfBirth: normalizeDateForInput(source.dateOfBirth),
      address: toText(source.address),
      designation: toText(source.designation),
      hourlyRate: toNumberText(source.hourlyRate),
    });
  }, [profile]);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timer = setTimeout(() => {
      setToast(null);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [toast]);

  const canRender = useMemo(
    () => isAuthenticated && isCaregiverRole(userRole),
    [isAuthenticated, userRole],
  );

  const trimmedForm = useMemo(
    () => ({
      phoneNumber: formState.phoneNumber.trim(),
      dateOfBirth: formState.dateOfBirth.trim(),
      address: formState.address.trim(),
      designation: formState.designation.trim(),
      hourlyRate: formState.hourlyRate.trim(),
    }),
    [formState],
  );

  const isHourlyRateValid = useMemo(() => {
    if (!trimmedForm.hourlyRate) {
      return false;
    }

    const parsed = Number(trimmedForm.hourlyRate);
    return Number.isFinite(parsed) && parsed >= 0;
  }, [trimmedForm.hourlyRate]);

  const isFormValid = useMemo(
    () =>
      Boolean(
        trimmedForm.phoneNumber &&
          trimmedForm.dateOfBirth &&
          trimmedForm.address &&
          trimmedForm.designation &&
          isHourlyRateValid,
      ),
    [isHourlyRateValid, trimmedForm.address, trimmedForm.dateOfBirth, trimmedForm.designation, trimmedForm.phoneNumber],
  );

  if (!canRender) {
    return (
      <main className="min-h-screen bg-[#f7f9fc] px-4 py-8 sm:px-6 lg:px-8">
        <section className="mx-auto max-w-4xl rounded-2xl bg-white p-6 shadow-lg shadow-[#d8e3f0]/35">
          <p className="text-sm font-medium text-[#191c1e]">Redirecting to login...</p>
        </section>
      </main>
    );
  }

  const onFieldChange = (key: keyof FormState) => (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setFormState((previous) => ({ ...previous, [key]: value }));
  };

  const applySelectedFile = (file: File | null, setter: (value: File | null) => void) => {
    if (!file) {
      setter(null);
      return;
    }

    const validationMessage = validateFile(file);

    if (validationMessage) {
      setter(null);
      setToast({ message: validationMessage, tone: "error" });
      return;
    }

    setter(file);
  };

  const onSelectFile =
    (setter: (file: File | null) => void) => (event: ChangeEvent<HTMLInputElement>) => {
      const selected = event.target.files?.[0] ?? null;
      applySelectedFile(selected, setter);
    };

  const onDropFile =
    (
      zone: "id" | "cert",
      setter: (file: File | null) => void,
    ) =>
    (event: DragEvent<HTMLLabelElement>) => {
      event.preventDefault();
      setActiveDropZone(null);
      const dropped = event.dataTransfer.files?.[0] ?? null;
      applySelectedFile(dropped, setter);
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isFormValid) {
      setToast({ message: "Please complete all required fields with valid values.", tone: "error" });
      return;
    }

    try {
      await updateCaregiverProfile(
        {
          ...trimmedForm,
          hourlyRate: Number(trimmedForm.hourlyRate),
        },
        idFile ?? undefined,
        certFile ?? undefined,
      );

      setToast({ message: "Profile updated successfully.", tone: "success" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update caregiver profile.";
      setToast({ message, tone: "error" });
    }
  };

  return (
    <CaregiverShell activeItem="profile" pageSubtitle="Caregiver Profile Update">
      <section className="mx-auto max-w-4xl rounded-3xl bg-[#f7f9fc] p-5 sm:p-8">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <article className="rounded-2xl bg-white p-8 shadow-lg shadow-[#d8e3f0]/35">
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-[#191c1e]">
              Personal Details
            </h1>
            <p className="mt-2 text-sm text-[#4e5960]">
              Keep your contact and professional information accurate for assignment matching.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-[#4e5960]">Phone Number</span>
                <input
                  type="tel"
                  value={formState.phoneNumber}
                  onChange={onFieldChange("phoneNumber")}
                  required
                  placeholder="+1 555 000 0000"
                  className="h-12 w-full rounded-xl bg-[#f7f9fc] px-4 text-sm text-[#191c1e] outline-none ring-1 ring-gray-300/15 transition focus:ring-2 focus:ring-[#8ec7e8]"
                />
              </label>

              <label className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-[#4e5960]">Date of Birth</span>
                <input
                  type="date"
                  value={formState.dateOfBirth}
                  onChange={onFieldChange("dateOfBirth")}
                  required
                  className="h-12 w-full rounded-xl bg-[#f7f9fc] px-4 text-sm text-[#191c1e] outline-none ring-1 ring-gray-300/15 transition focus:ring-2 focus:ring-[#8ec7e8]"
                />
              </label>

              <label className="space-y-1.5 sm:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-[#4e5960]">Address</span>
                <input
                  type="text"
                  value={formState.address}
                  onChange={onFieldChange("address")}
                  required
                  placeholder="Street, City, State"
                  className="h-12 w-full rounded-xl bg-[#f7f9fc] px-4 text-sm text-[#191c1e] outline-none ring-1 ring-gray-300/15 transition focus:ring-2 focus:ring-[#8ec7e8]"
                />
              </label>

              <label className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-[#4e5960]">Designation</span>
                <input
                  type="text"
                  value={formState.designation}
                  onChange={onFieldChange("designation")}
                  required
                  placeholder="Certified Nursing Assistant"
                  className="h-12 w-full rounded-xl bg-[#f7f9fc] px-4 text-sm text-[#191c1e] outline-none ring-1 ring-gray-300/15 transition focus:ring-2 focus:ring-[#8ec7e8]"
                />
              </label>

              <label className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-[#4e5960]">Hourly Rate</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formState.hourlyRate}
                  onChange={onFieldChange("hourlyRate")}
                  required
                  placeholder="25.00"
                  className="h-12 w-full rounded-xl bg-[#f7f9fc] px-4 text-sm text-[#191c1e] outline-none ring-1 ring-gray-300/15 transition focus:ring-2 focus:ring-[#8ec7e8]"
                />
                {!isHourlyRateValid && formState.hourlyRate.trim() ? (
                  <p className="text-xs font-medium text-[#9b2f2f]">Hourly rate must be a valid non-negative number.</p>
                ) : null}
              </label>
            </div>
          </article>

          <article className="rounded-2xl bg-white p-8 shadow-lg shadow-[#d8e3f0]/35">
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-[#191c1e]">
              Verification Documents
            </h2>
            <p className="mt-2 text-sm text-[#4e5960]">
              Upload clear image files (.jpg, .png, .webp, max 5MB each).
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label
                className={[
                  "group block cursor-pointer rounded-2xl bg-[#f7f9fc] p-5 transition",
                  activeDropZone === "id" ? "bg-[#eaf4fb] ring-2 ring-[#8ec7e8]" : "hover:bg-[#eef4fa]",
                ].join(" ")}
                onDragOver={(event) => {
                  event.preventDefault();
                  setActiveDropZone("id");
                }}
                onDragLeave={() => {
                  setActiveDropZone((previous) => (previous === "id" ? null : previous));
                }}
                onDrop={onDropFile("id", setIdFile)}
              >
                <span className="text-sm font-semibold text-[#191c1e]">Driver&apos;s License</span>
                <p className="mt-1 text-xs text-[#4e5960]">Identity document for verification. Click or drag and drop.</p>
                <span className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#191c1e] ring-1 ring-gray-300/15">
                  Choose Image
                </span>
                <p className="mt-3 truncate text-xs text-[#4e5960]">{idFile ? idFile.name : "No file selected"}</p>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  className="hidden"
                  onChange={onSelectFile(setIdFile)}
                />
              </label>

              <label
                className={[
                  "group block cursor-pointer rounded-2xl bg-[#f7f9fc] p-5 transition",
                  activeDropZone === "cert" ? "bg-[#eaf4fb] ring-2 ring-[#8ec7e8]" : "hover:bg-[#eef4fa]",
                ].join(" ")}
                onDragOver={(event) => {
                  event.preventDefault();
                  setActiveDropZone("cert");
                }}
                onDragLeave={() => {
                  setActiveDropZone((previous) => (previous === "cert" ? null : previous));
                }}
                onDrop={onDropFile("cert", setCertFile)}
              >
                <span className="text-sm font-semibold text-[#191c1e]">CNA Certificate</span>
                <p className="mt-1 text-xs text-[#4e5960]">Professional certification proof. Click or drag and drop.</p>
                <span className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#191c1e] ring-1 ring-gray-300/15">
                  Choose Image
                </span>
                <p className="mt-3 truncate text-xs text-[#4e5960]">{certFile ? certFile.name : "No file selected"}</p>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  className="hidden"
                  onChange={onSelectFile(setCertFile)}
                />
              </label>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={isLoading || !isFormValid}
                className="inline-flex h-12 items-center justify-center rounded-full bg-linear-to-r from-[#0d6b9a] to-[#1f9ab7] px-7 text-sm font-bold text-white shadow-lg shadow-[#b8d8ea]/70 transition hover:from-[#0b5d87] hover:to-[#1b89a3] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? "Saving..." : "Save & Submit for Review"}
              </button>
            </div>
          </article>
        </form>
      </section>

      {toast ? (
        <div
          className={[
            "fixed bottom-6 right-6 z-50 rounded-2xl px-4 py-3 text-sm font-semibold shadow-xl",
            toast.tone === "success"
              ? "bg-[#e8f6ef] text-[#1f6f48]"
              : "bg-[#fdeeee] text-[#9b2f2f]",
          ].join(" ")}
          role="status"
          aria-live="polite"
        >
          {toast.message}
        </div>
      ) : null}
    </CaregiverShell>
  );
}
