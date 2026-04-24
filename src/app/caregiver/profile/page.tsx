"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, type ChangeEvent, type DragEvent, type FormEvent } from "react";

import { CaregiverShell } from "@/components/dashboard/caregiver/CaregiverShell";
import { ROUTES } from "@/lib/routes";
import { useAuthStore } from "@/store/useAuthStore";
import { useProfileStore } from "@/store/useProfileStore";
import { geocodeAddressCoordinates, getCurrentCoordinates, reverseGeocodeAddress } from "@/utils/geolocation";

type FormState = {
  phoneNumber: string;
  dateOfBirth: string;
  address: string;
  designation: string;
  hourlyRate: string;
};

type PersistedProfileImage = {
  url: string | null;
};

type Coordinates = {
  latitude: number;
  longitude: number;
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

function countDigits(value: string) {
  return value.replace(/\D/g, "").length;
}

function normalizePhoneNumber(value: string) {
  const trimmed = value.trim();
  const hasPlusPrefix = trimmed.startsWith("+");
  const digits = value.replace(/\D/g, "");

  if (!digits) {
    return "";
  }

  return `${hasPlusPrefix ? "+" : ""}${digits}`;
}

function isFutureDate(value: string) {
  if (!value) {
    return false;
  }

  const selected = new Date(`${value}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return selected.getTime() > today.getTime();
}

function getProfileImageUrl(source: Record<string, unknown>): string | null {
  const candidates = [source.profileImageUrl, source.profileImage, source.avatarUrl, source.imageUrl];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate;
    }
  }

  return null;
}

function getInitials(value: string) {
  const words = value.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return "CG";
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0] ?? ""}${words[1][0] ?? ""}`.toUpperCase();
}

export default function CaregiverProfileUpdatePage() {
  const router = useRouter();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const userRole = useAuthStore((state) => state.user?.role);
  const userEmail = useAuthStore((state) => state.user?.email);

  const profile = useProfileStore((state) => state.profile);
  const isLoading = useProfileStore((state) => state.isLoading);
  const fetchProfile = useProfileStore((state) => state.fetchProfile);
  const updateCaregiverProfile = useProfileStore((state) => state.updateCaregiverProfile);

  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [initialFormSnapshot, setInitialFormSnapshot] = useState<FormState>(initialFormState);
  const [profileImageSnapshot, setProfileImageSnapshot] = useState<PersistedProfileImage>({ url: null });
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreviewUrl, setProfileImagePreviewUrl] = useState<string | null>(null);
  const [coordinatesSnapshot, setCoordinatesSnapshot] = useState<Coordinates | null>(null);
  const [selectedCoordinates, setSelectedCoordinates] = useState<Coordinates | null>(null);
  const [isResolvingLocation, setIsResolvingLocation] = useState(false);
  const [idFile, setIdFile] = useState<File | null>(null);
  const [certFile, setCertFile] = useState<File | null>(null);
  const [activeDropZone, setActiveDropZone] = useState<"avatar" | "id" | "cert" | null>(null);
  const [toast, setToast] = useState<ToastState>(null);
  const [isBootstrapLoading, setIsBootstrapLoading] = useState(true);
  const [profileLoadError, setProfileLoadError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const loadProfile = useCallback(async () => {
    setIsBootstrapLoading(true);
    setProfileLoadError(null);

    try {
      await fetchProfile();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load caregiver profile.";
      setProfileLoadError(message);
      setToast({ message, tone: "error" });
    } finally {
      setIsBootstrapLoading(false);
    }
  }, [fetchProfile]);

  useEffect(() => {
    if (!isAuthenticated || !isCaregiverRole(userRole)) {
      router.replace(ROUTES.login);
      return;
    }

    void loadProfile();
  }, [isAuthenticated, loadProfile, router, userRole]);

  useEffect(() => {
    if (!profile) {
      return;
    }

    const source = profile as Record<string, unknown>;

    const nextFormState = {
      phoneNumber: toText(source.phoneNumber),
      dateOfBirth: normalizeDateForInput(source.dateOfBirth),
      address: toText(source.address),
      designation: toText(source.designation),
      hourlyRate: toNumberText(source.hourlyRate),
    };
    const nextProfileImageUrl = getProfileImageUrl(source);
    const nextCoordinates =
      typeof source.latitude === "number" && typeof source.longitude === "number"
        ? { latitude: source.latitude, longitude: source.longitude }
        : null;

    setFormState(nextFormState);
    setInitialFormSnapshot(nextFormState);
    setProfileImageUrl(nextProfileImageUrl);
    setProfileImageSnapshot({ url: nextProfileImageUrl });
    setCoordinatesSnapshot(nextCoordinates);
    setSelectedCoordinates(nextCoordinates);
    setProfileImageFile(null);
    setProfileImagePreviewUrl((previous) => {
      if (previous) {
        URL.revokeObjectURL(previous);
      }

      return null;
    });
  }, [profile]);

  useEffect(() => {
    return () => {
      if (profileImagePreviewUrl) {
        URL.revokeObjectURL(profileImagePreviewUrl);
      }
    };
  }, [profileImagePreviewUrl]);

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

  const trimmedInitialForm = useMemo(
    () => ({
      phoneNumber: initialFormSnapshot.phoneNumber.trim(),
      dateOfBirth: initialFormSnapshot.dateOfBirth.trim(),
      address: initialFormSnapshot.address.trim(),
      designation: initialFormSnapshot.designation.trim(),
      hourlyRate: initialFormSnapshot.hourlyRate.trim(),
    }),
    [initialFormSnapshot],
  );

  const isHourlyRateValid = useMemo(() => {
    if (!trimmedForm.hourlyRate) {
      return false;
    }

    const parsed = Number(trimmedForm.hourlyRate);
    return Number.isFinite(parsed) && parsed >= 0;
  }, [trimmedForm.hourlyRate]);

  const isPhoneValid = useMemo(() => countDigits(trimmedForm.phoneNumber) >= 10, [trimmedForm.phoneNumber]);
  const normalizedPhoneNumber = useMemo(
    () => normalizePhoneNumber(trimmedForm.phoneNumber),
    [trimmedForm.phoneNumber],
  );

  const isPhoneRegexValid = useMemo(
    () => /^\+?[0-9]{7,15}$/.test(normalizedPhoneNumber),
    [normalizedPhoneNumber],
  );

  const isDateOfBirthValid = useMemo(
    () => Boolean(trimmedForm.dateOfBirth) && !isFutureDate(trimmedForm.dateOfBirth),
    [trimmedForm.dateOfBirth],
  );

  const isFormValid = useMemo(
    () =>
      Boolean(
        trimmedForm.phoneNumber &&
          isPhoneValid &&
          isPhoneRegexValid &&
          isDateOfBirthValid &&
          trimmedForm.address &&
          trimmedForm.designation &&
          isHourlyRateValid,
      ),
    [
      isDateOfBirthValid,
      isHourlyRateValid,
      isPhoneValid,
      isPhoneRegexValid,
      trimmedForm.address,
      trimmedForm.designation,
      trimmedForm.phoneNumber,
    ],
  );

  const hasUnsavedChanges = useMemo(
    () =>
      trimmedForm.phoneNumber !== trimmedInitialForm.phoneNumber ||
      trimmedForm.dateOfBirth !== trimmedInitialForm.dateOfBirth ||
      trimmedForm.address !== trimmedInitialForm.address ||
      trimmedForm.designation !== trimmedInitialForm.designation ||
      trimmedForm.hourlyRate !== trimmedInitialForm.hourlyRate ||
      selectedCoordinates?.latitude !== coordinatesSnapshot?.latitude ||
      selectedCoordinates?.longitude !== coordinatesSnapshot?.longitude ||
      profileImageUrl !== profileImageSnapshot.url ||
      Boolean(profileImageFile) ||
      Boolean(idFile) ||
      Boolean(certFile),
    [
      certFile,
      coordinatesSnapshot?.latitude,
      coordinatesSnapshot?.longitude,
      idFile,
      profileImageFile,
      profileImageSnapshot.url,
      profileImageUrl,
      selectedCoordinates?.latitude,
      selectedCoordinates?.longitude,
      trimmedForm,
      trimmedInitialForm,
    ],
  );

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!hasUnsavedChanges) {
        return;
      }

      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  if (!isHydrated || !canRender) {
    return (
      <main className="min-h-screen bg-[#f7f9fc] px-4 py-8 sm:px-6 lg:px-8">
        <section className="mx-auto max-w-4xl rounded-2xl bg-white p-6 shadow-lg shadow-[#d8e3f0]/35">
          <p className="text-sm font-medium text-[#191c1e]">Redirecting to login...</p>
        </section>
      </main>
    );
  }

  if (isBootstrapLoading && !profile) {
    return (
      <CaregiverShell activeItem="profile" pageSubtitle="Caregiver Profile Update">
        <section className="mx-auto max-w-4xl rounded-3xl bg-[#f7f9fc] p-5 sm:p-8">
          <article className="rounded-2xl bg-white p-8 shadow-lg shadow-[#d8e3f0]/35">
            <p className="text-sm font-medium text-[#4e5960]">Loading profile details...</p>
          </article>
        </section>
      </CaregiverShell>
    );
  }

  if (!isBootstrapLoading && !profile && profileLoadError) {
    return (
      <CaregiverShell activeItem="profile" pageSubtitle="Caregiver Profile Update">
        <section className="mx-auto max-w-4xl rounded-3xl bg-[#f7f9fc] p-5 sm:p-8">
          <article className="rounded-2xl bg-white p-8 shadow-lg shadow-[#d8e3f0]/35">
            <p className="text-sm font-semibold text-[#9b2f2f]">Unable to load profile details.</p>
            <p className="mt-2 text-sm text-[#4e5960]">{profileLoadError}</p>
            <button
              type="button"
              className="mt-5 inline-flex h-10 items-center justify-center rounded-full bg-linear-to-r from-[#0d6b9a] to-[#1f9ab7] px-5 text-sm font-semibold text-white transition hover:from-[#0b5d87] hover:to-[#1b89a3]"
              onClick={() => {
                void loadProfile();
              }}
            >
              Retry
            </button>
          </article>
        </section>
      </CaregiverShell>
    );
  }

  const onFieldChange = (key: keyof FormState) => (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setFormState((previous) => ({ ...previous, [key]: value }));

    if (key === "address") {
      setSelectedCoordinates(null);
    }
  };

  const handleUseCurrentLocation = async () => {
    setIsResolvingLocation(true);

    try {
      const coordinates = await getCurrentCoordinates();

      if (!coordinates) {
        setToast({ message: "Unable to access current location.", tone: "error" });
        return;
      }

      setSelectedCoordinates(coordinates);

      const resolvedAddress = await reverseGeocodeAddress(coordinates.latitude, coordinates.longitude);

      if (resolvedAddress) {
        setFormState((previous) => ({ ...previous, address: resolvedAddress }));
      }

      setToast({ message: "Current location applied.", tone: "success" });
    } finally {
      setIsResolvingLocation(false);
    }
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

  const handleProfileImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0] ?? null;

    if (!selected) {
      return;
    }

    const validationMessage = validateFile(selected);

    if (validationMessage) {
      setToast({ message: validationMessage, tone: "error" });
      return;
    }

    const nextPreviewUrl = URL.createObjectURL(selected);

    setProfileImagePreviewUrl((previous) => {
      if (previous) {
        URL.revokeObjectURL(previous);
      }

      return nextPreviewUrl;
    });
    setProfileImageFile(selected);
    setProfileImageUrl(nextPreviewUrl);
  };

  const setProfileImageFromFile = (file: File | null) => {
    if (!file) {
      return;
    }

    const validationMessage = validateFile(file);

    if (validationMessage) {
      setToast({ message: validationMessage, tone: "error" });
      return;
    }

    const nextPreviewUrl = URL.createObjectURL(file);

    setProfileImagePreviewUrl((previous) => {
      if (previous) {
        URL.revokeObjectURL(previous);
      }

      return nextPreviewUrl;
    });
    setProfileImageFile(file);
    setProfileImageUrl(nextPreviewUrl);
  };

  const handleProfileImageDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setActiveDropZone(null);
    const dropped = event.dataTransfer.files?.[0] ?? null;
    setProfileImageFromFile(dropped);
  };

  const handleRemoveProfileImage = () => {
    setProfileImageFile(null);
    setProfileImageUrl(profileImageSnapshot.url);
    setProfileImagePreviewUrl((previous) => {
      if (previous) {
        URL.revokeObjectURL(previous);
      }

      return null;
    });
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
      const fallbackCoordinates = selectedCoordinates ?? (await geocodeAddressCoordinates(trimmedForm.address));

      await updateCaregiverProfile(
        {
          ...trimmedForm,
          phoneNumber: normalizedPhoneNumber,
          hourlyRate: Number(trimmedForm.hourlyRate),
          ...(fallbackCoordinates
            ? {
                latitude: fallbackCoordinates.latitude,
                longitude: fallbackCoordinates.longitude,
              }
            : {}),
        },
        idFile ?? undefined,
        certFile ?? undefined,
        profileImageFile ?? undefined,
      );

      setToast({ message: "Profile updated successfully.", tone: "success" });
      setInitialFormSnapshot({
        phoneNumber: trimmedForm.phoneNumber,
        dateOfBirth: trimmedForm.dateOfBirth,
        address: trimmedForm.address,
        designation: trimmedForm.designation,
        hourlyRate: trimmedForm.hourlyRate,
      });
      setProfileImageSnapshot({ url: profileImageUrl });
      setCoordinatesSnapshot(fallbackCoordinates);
      setSelectedCoordinates(fallbackCoordinates);
      setProfileImageFile(null);
      setProfileImagePreviewUrl((previous) => {
        if (previous) {
          URL.revokeObjectURL(previous);
        }

        return null;
      });
      setIdFile(null);
      setCertFile(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update caregiver profile.";
      setToast({ message, tone: "error" });
    }
  };

  const handleResetChanges = () => {
    setFormState(initialFormSnapshot);
    setSelectedCoordinates(coordinatesSnapshot);
    setProfileImageFile(null);
    setProfileImageUrl(profileImageSnapshot.url);
    setProfileImagePreviewUrl((previous) => {
      if (previous) {
        URL.revokeObjectURL(previous);
      }

      return null;
    });
    setIdFile(null);
    setCertFile(null);
    setToast({ message: "Changes reverted to last saved values.", tone: "success" });
  };

  const profileName = (toText((profile as Record<string, unknown> | null)?.name) || userEmail || "Caregiver").trim();
  const designationLabel = trimmedForm.designation || "Certified Nursing Assistant";
  const avatarInitials = getInitials(profileName);

  return (
    <CaregiverShell activeItem="profile" pageSubtitle="Caregiver Profile Update">
      <section className="mx-auto max-w-4xl rounded-3xl bg-[#f7f9fc] p-5 sm:p-8">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {hasUnsavedChanges ? (
            <p className="rounded-xl bg-[#fff4df] px-4 py-3 text-sm font-medium text-[#7a541b]">
              You have unsaved changes.
            </p>
          ) : null}

          <article className="rounded-2xl bg-white p-8 shadow-lg shadow-[#d8e3f0]/35">
            <div className="flex flex-col items-center text-center">
              <div
                className={[
                  "relative h-28 w-28 rounded-full transition",
                  activeDropZone === "avatar" ? "ring-4 ring-[#8ec7e8]" : "",
                ].join(" ")}
                onDragOver={(event) => {
                  event.preventDefault();
                  setActiveDropZone("avatar");
                }}
                onDragLeave={() => {
                  setActiveDropZone((previous) => (previous === "avatar" ? null : previous));
                }}
                onDrop={handleProfileImageDrop}
              >
                {profileImageUrl ? (
                  <img
                    src={profileImageUrl}
                    alt="Caregiver profile"
                    className="h-28 w-28 rounded-full object-cover ring-4 ring-[#d7ecf7]"
                  />
                ) : (
                  <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[#4cbfca] text-2xl font-extrabold text-white ring-4 ring-[#d7ecf7]">
                    {avatarInitials}
                  </div>
                )}

                <label className="absolute -bottom-1 -right-1 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#0d5f87] text-xl font-bold text-white shadow-md transition hover:bg-[#0b4f71]">
                  +
                  <span className="sr-only">Change profile image</span>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    className="hidden"
                    onChange={handleProfileImageChange}
                  />
                </label>
              </div>

              <p className="mt-4 text-3xl font-display font-extrabold tracking-tight text-[#191c1e]">{profileName}</p>
              <p className="mt-1 text-sm text-[#4e5960]">{designationLabel}</p>
              <p className="mt-2 text-xs text-[#5f6a71]">Click + or drag and drop a profile image (JPG, PNG, WEBP)</p>

              {profileImageFile ? (
                <button
                  type="button"
                  className="mt-3 text-xs font-semibold text-[#7f3f3f] transition hover:text-[#652f2f]"
                  onClick={handleRemoveProfileImage}
                >
                  Remove selected image
                </button>
              ) : null}
            </div>
          </article>

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
                  placeholder="Your Contact Number"
                  className="h-12 w-full rounded-xl bg-[#f7f9fc] px-4 text-sm text-[#191c1e] outline-none ring-1 ring-gray-300/15 transition focus:ring-2 focus:ring-[#8ec7e8]"
                />
                {(!isPhoneValid || !isPhoneRegexValid) && formState.phoneNumber.trim() ? (
                  <p className="text-xs font-medium text-[#9b2f2f]">Enter a valid phone number format (e.g., +94771234567).</p>
                ) : null}
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
                {!isDateOfBirthValid && formState.dateOfBirth.trim() ? (
                  <p className="text-xs font-medium text-[#9b2f2f]">Date of birth cannot be in the future.</p>
                ) : null}
              </label>

              <label className="space-y-1.5 sm:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-[#4e5960]">Address</span>
                <div className="mb-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      void handleUseCurrentLocation();
                    }}
                    disabled={isResolvingLocation}
                    className="inline-flex h-9 items-center justify-center rounded-full bg-[#eef4fa] px-4 text-xs font-semibold text-[#2f4f64] transition hover:bg-[#e4edf6] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isResolvingLocation ? "Locating..." : "Current Location"}
                  </button>
                </div>
                <input
                  type="text"
                  value={formState.address}
                  onChange={onFieldChange("address")}
                  required
                  placeholder="City / District / Province"
                  className="h-12 w-full rounded-xl bg-[#f7f9fc] px-4 text-sm text-[#191c1e] outline-none ring-1 ring-gray-300/15 transition focus:ring-2 focus:ring-[#8ec7e8]"
                />
                {selectedCoordinates ? (
                  <p className="mt-2 text-xs text-[#5f6a71]">
                    Coordinates: {selectedCoordinates.latitude.toFixed(6)}, {selectedCoordinates.longitude.toFixed(6)}
                  </p>
                ) : null}
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
                <span className="text-xs font-semibold uppercase tracking-wide text-[#4e5960]">Hourly Rate (LKR)</span>
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
                <span className="text-sm font-semibold text-[#191c1e]">NIC</span>
                <p className="mt-1 text-xs text-[#4e5960]">Identity document for verification. Click or drag and drop.</p>
                <span className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#191c1e] ring-1 ring-gray-300/15">
                  Choose Image
                </span>
                <p className="mt-3 truncate text-xs text-[#4e5960]">{idFile ? idFile.name : "No file selected"}</p>
                {idFile ? (
                  <button
                    type="button"
                    className="mt-2 text-xs font-semibold text-[#7f3f3f] transition hover:text-[#652f2f]"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      setIdFile(null);
                    }}
                  >
                    Remove file
                  </button>
                ) : null}
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
                {certFile ? (
                  <button
                    type="button"
                    className="mt-2 text-xs font-semibold text-[#7f3f3f] transition hover:text-[#652f2f]"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      setCertFile(null);
                    }}
                  >
                    Remove file
                  </button>
                ) : null}
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  className="hidden"
                  onChange={onSelectFile(setCertFile)}
                />
              </label>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                disabled={isLoading || !hasUnsavedChanges}
                onClick={handleResetChanges}
                className="inline-flex h-12 items-center justify-center rounded-full bg-[#eef4fa] px-6 text-sm font-semibold text-[#2f4f64] transition hover:bg-[#e4edf6] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Reset changes
              </button>
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
