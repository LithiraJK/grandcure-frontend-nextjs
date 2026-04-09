"use client";

import { Loader2, X } from "lucide-react";
import { useMemo, useState } from "react";

import {
  type CreateAssignmentRequestPayload,
  useAssignmentStore,
} from "@/store/useAssignmentStore";

type Coordinates = {
  latitude: number;
  longitude: number;
};

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
  profileCoordinates: _profileCoordinates,
}: RequestCareModalProps) {
  const createRequest = useAssignmentStore((state) => state.createRequest);
  const [requestType, setRequestType] = useState<CreateAssignmentRequestPayload["type"]>("NORMAL");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const resolvedProfileAddress = useMemo(
    () => (profileAddress ?? "").trim(),
    [profileAddress],
  );

  const today = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }, []);

  if (!isOpen) {
    return null;
  }

  const resetForm = () => {
    setRequestType("NORMAL");
    setDate("");
    setStartTime("");
    setEndTime("");
    setLocation(resolvedProfileAddress);
    setNotes("");
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

    if (!date) {
      setFormError("Please select a date.");
      return;
    }

    if (!startTime || !endTime) {
      setFormError("Please select start and end times.");
      return;
    }

    if (startTime >= endTime) {
      setFormError("End time must be later than start time.");
      return;
    }

    const trimmedLocation = location.trim();
    if (!trimmedLocation) {
      setFormError("Please enter a location.");
      return;
    }

    const trimmedNotes = notes.trim();
    if (!trimmedNotes) {
      setFormError("Please enter request notes.");
      return;
    }

    setIsSubmitting(true);

    try {
      await createRequest({
        type: requestType,
        date,
        startTime,
        endTime,
        location: trimmedLocation,
        notes: trimmedNotes,
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
              Fill appointment date/time, location, and notes to submit your request.
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

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2 sm:col-span-3">
              <label htmlFor="request-date" className="text-sm font-semibold text-zinc-800">
                Date
              </label>
              <input
                id="request-date"
                type="date"
                min={today}
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className="h-11 w-full rounded-2xl bg-[#f3f8fc] px-4 text-sm text-zinc-900 outline-none transition focus:bg-white"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="request-start-time" className="text-sm font-semibold text-zinc-800">
                Start Time
              </label>
              <input
                id="request-start-time"
                type="time"
                value={startTime}
                onChange={(event) => setStartTime(event.target.value)}
                className="h-11 w-full rounded-2xl bg-[#f3f8fc] px-4 text-sm text-zinc-900 outline-none transition focus:bg-white"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="request-end-time" className="text-sm font-semibold text-zinc-800">
                End Time
              </label>
              <input
                id="request-end-time"
                type="time"
                value={endTime}
                onChange={(event) => setEndTime(event.target.value)}
                className="h-11 w-full rounded-2xl bg-[#f3f8fc] px-4 text-sm text-zinc-900 outline-none transition focus:bg-white"
              />
            </div>

            <div className="space-y-2 sm:col-span-3">
              <label htmlFor="request-location" className="text-sm font-semibold text-zinc-800">
                Location
              </label>
              <input
                id="request-location"
                type="text"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder={resolvedProfileAddress || "Enter location (e.g. Colombo 05)"}
                className="h-11 w-full rounded-2xl bg-[#f3f8fc] px-4 text-sm text-zinc-900 outline-none transition placeholder:text-secondary focus:bg-white"
              />
            </div>
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
