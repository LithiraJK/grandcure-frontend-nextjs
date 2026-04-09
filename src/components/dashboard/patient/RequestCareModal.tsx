"use client";

import { Loader2, MapPin, X } from "lucide-react";
import { useMemo, useState } from "react";

import { getCoordinates } from "@/utils/geolocation";
import {
  type CreateAssignmentRequestPayload,
  useAssignmentStore,
} from "@/store/useAssignmentStore";

type Coordinates = {
  latitude: number;
  longitude: number;
};

type LocationMode = "profile" | "different";

type RequestCareModalProps = {
  isOpen: boolean;
  onClose: () => void;
  profileAddress?: string | null;
  profileCoordinates?: Coordinates | null;
};

export function RequestCareModal({
  isOpen,
  onClose,
  profileAddress,
  profileCoordinates,
}: RequestCareModalProps) {
  const createRequest = useAssignmentStore((state) => state.createRequest);
  const [requestType, setRequestType] = useState<CreateAssignmentRequestPayload["type"]>("NORMAL");
  const [notes, setNotes] = useState("");
  const [locationMode, setLocationMode] = useState<LocationMode>("profile");
  const [differentAddress, setDifferentAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const resolvedProfileAddress = useMemo(
    () => (profileAddress ?? "").trim(),
    [profileAddress],
  );

  if (!isOpen) {
    return null;
  }

  const resetForm = () => {
    setRequestType("NORMAL");
    setNotes("");
    setLocationMode("profile");
    setDifferentAddress("");
    setFormError(null);
  };

  const handleClose = () => {
    if (isSubmitting) {
      return;
    }

    resetForm();
    onClose();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const trimmedNotes = notes.trim();
    if (!trimmedNotes) {
      setFormError("Please enter request notes.");
      return;
    }

    setIsSubmitting(true);

    try {
      let finalAddress = "";
      let finalCoordinates: Coordinates | null = null;

      if (locationMode === "profile") {
        if (!resolvedProfileAddress) {
          setFormError("Profile address is not available. Please use a different location.");
          return;
        }

        finalAddress = resolvedProfileAddress;
        finalCoordinates = profileCoordinates ?? (await getCoordinates(resolvedProfileAddress));
      } else {
        const trimmedAddress = differentAddress.trim();

        if (!trimmedAddress) {
          setFormError("Please enter a location.");
          return;
        }

        finalAddress = trimmedAddress;
        finalCoordinates = await getCoordinates(trimmedAddress);
      }

      if (!finalCoordinates) {
        setFormError("Unable to resolve location coordinates. Please try another address.");
        return;
      }

      await createRequest({
        type: requestType,
        notes: trimmedNotes,
        latitude: finalCoordinates.latitude,
        longitude: finalCoordinates.longitude,
        address: finalAddress,
      });

      resetForm();
      onClose();
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Failed to create care request. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b2030]/35 p-4"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-2xl rounded-3xl bg-white/90 p-6 shadow-2xl backdrop-blur-xl sm:p-7"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-primary">New Request</p>
            <h2 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-zinc-900">
              Request Care
            </h2>
            <p className="mt-2 text-sm text-secondary">
              Select service type, add notes, and confirm your pickup location.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-zinc-600 transition hover:bg-white"
            aria-label="Close request care modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="request-type" className="text-sm font-semibold text-zinc-800">
              Care Type
            </label>
            <select
              id="request-type"
              value={requestType}
              onChange={(event) => setRequestType(event.target.value as CreateAssignmentRequestPayload["type"])}
              className="h-11 w-full rounded-2xl bg-[#f3f8fc] px-4 text-sm text-zinc-900 outline-none transition focus:bg-white"
            >
              <option value="NORMAL">NORMAL</option>
              <option value="URGENT">URGENT</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="request-notes" className="text-sm font-semibold text-zinc-800">
              Notes
            </label>
            <textarea
              id="request-notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={4}
              placeholder="Describe the care you need..."
              className="w-full rounded-2xl bg-[#f3f8fc] px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-secondary focus:bg-white"
            />
          </div>

          <div className="space-y-3 rounded-2xl bg-[#edf4fa] p-4">
            <p className="text-sm font-semibold text-zinc-900">Location</p>

            <div className="inline-flex flex-wrap gap-2 rounded-2xl bg-white/80 p-1.5">
              <button
                type="button"
                onClick={() => setLocationMode("profile")}
                className={[
                  "rounded-xl px-3 py-2 text-xs font-semibold transition",
                  locationMode === "profile"
                    ? "bg-white text-primary shadow-sm"
                    : "text-secondary hover:text-zinc-900",
                ].join(" ")}
              >
                Use My Profile Address
              </button>
              <button
                type="button"
                onClick={() => setLocationMode("different")}
                className={[
                  "rounded-xl px-3 py-2 text-xs font-semibold transition",
                  locationMode === "different"
                    ? "bg-white text-primary shadow-sm"
                    : "text-secondary hover:text-zinc-900",
                ].join(" ")}
              >
                Enter Different Location
              </button>
            </div>

            {locationMode === "profile" ? (
              <div className="inline-flex min-h-11 w-full items-center gap-2 rounded-2xl bg-white px-4 text-sm text-zinc-800">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{resolvedProfileAddress || "No profile address found"}</span>
              </div>
            ) : (
              <div className="space-y-2">
                <label htmlFor="different-address" className="text-xs font-semibold text-secondary">
                  Address
                </label>
                <input
                  id="different-address"
                  type="text"
                  value={differentAddress}
                  onChange={(event) => setDifferentAddress(event.target.value)}
                  placeholder="Enter pickup location"
                  className="h-11 w-full rounded-2xl bg-white px-4 text-sm text-zinc-900 outline-none transition placeholder:text-secondary"
                />
              </div>
            )}
          </div>

          {formError ? (
            <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
              {formError}
            </p>
          ) : null}

          <div className="flex flex-wrap items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="inline-flex h-11 items-center rounded-full bg-white px-5 text-sm font-semibold text-secondary transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-linear-to-r from-[#0f6d95] to-[#1799b5] px-6 text-sm font-bold text-white shadow-md transition hover:from-[#0d5f83] hover:to-[#14859d] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending Request...
                </>
              ) : (
                "Submit Request"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
