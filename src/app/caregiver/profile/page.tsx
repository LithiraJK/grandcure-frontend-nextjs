"use client";

import { CircleCheck, CircleX, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { CaregiverShell } from "@/components/dashboard/caregiver/CaregiverShell";
import { ROUTES } from "@/lib/routes";
import { useAuthStore } from "@/store/useAuthStore";

function isCaregiverRole(role: string | undefined) {
  if (!role) {
    return false;
  }

  const normalized = role.toUpperCase();
  return normalized === "CARE_GIVER" || normalized === "CAREGIVER";
}

export default function CaregiverProfilePage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const userRole = useAuthStore((state) => state.user?.role);

  useEffect(() => {
    if (!isAuthenticated || !isCaregiverRole(userRole)) {
      router.replace(ROUTES.login);
    }
  }, [isAuthenticated, router, userRole]);

  if (!isAuthenticated || !isCaregiverRole(userRole)) {
    return (
      <main className="min-h-screen bg-neutral px-4 py-8 sm:px-6 lg:px-8">
        <section className="mx-auto max-w-6xl rounded-3xl border border-zinc-200 bg-white p-6 shadow-soft">
          <p className="text-sm font-medium text-secondary">Redirecting to login...</p>
        </section>
      </main>
    );
  }

  return (
    <CaregiverShell activeItem="profile" pageSubtitle="Caregiver Identity & Verification">
      <section className="grid gap-5 lg:grid-cols-[290px_minmax(0,1fr)]">
        <div className="space-y-5">
          <article className="rounded-4xl border border-[#d8e4ee] bg-white p-6 shadow-soft">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#66d3de] text-3xl font-black text-white">
              S
            </div>

            <h2 className="mt-4 text-center font-display text-3xl font-extrabold tracking-tight text-zinc-900">
              Sarah Mitchell
            </h2>
            <p className="mt-1 text-center text-sm font-medium text-secondary">Certified Nursing Assistant</p>

            <div className="mt-5 space-y-2">
              <p className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-tertiary/12 px-3 py-2 text-xs font-semibold text-tertiary">
                <CircleCheck className="h-3.5 w-3.5" />
                Identity Verified
              </p>
              <p className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">
                <CircleX className="h-3.5 w-3.5" />
                Certificates Pending
              </p>
            </div>
          </article>

          <article className="rounded-4xl border border-[#d8e4ee] bg-white p-6 shadow-soft">
            <p className="inline-flex items-center gap-2 text-zinc-900">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span className="font-display text-2xl font-extrabold tracking-tight">Trust & Security</span>
            </p>

            <p className="mt-4 text-sm leading-relaxed text-secondary">
              GrandCure maintains the highest safety standards. All caregivers must provide
              valid government identification and professional certifications to receive client
              requests.
            </p>

            <ol className="mt-5 space-y-3">
              <li className="rounded-2xl bg-[#e9f7fb] px-3 py-2 text-xs font-semibold text-zinc-800">
                STEP 1
                <p className="mt-1 text-sm font-bold">Personal Details</p>
              </li>
              <li className="rounded-2xl bg-[#edf4fa] px-3 py-2 text-xs font-semibold text-zinc-800">
                STEP 2
                <p className="mt-1 text-sm font-bold">Upload Documents</p>
              </li>
              <li className="rounded-2xl bg-zinc-100 px-3 py-2 text-xs font-semibold text-zinc-800">
                STEP 3
                <p className="mt-1 text-sm font-bold">Final Review</p>
              </li>
            </ol>
          </article>
        </div>

        <div className="space-y-5">
          <article className="rounded-4xl border border-[#d8e4ee] bg-white p-6 shadow-soft sm:p-7">
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-zinc-900">Personal Details</h1>
            <p className="mt-2 text-sm text-secondary">
              Update your primary contact and residence information.
            </p>

            <form className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="space-y-1">
                <span className="text-xs font-semibold text-zinc-700">Full Name</span>
                <input
                  defaultValue="Sarah Mitchell"
                  className="h-11 w-full rounded-full border border-zinc-200 bg-zinc-100 px-4 text-sm text-zinc-800"
                />
              </label>

              <label className="space-y-1">
                <span className="text-xs font-semibold text-zinc-700">Email Address</span>
                <input
                  defaultValue="sarah.m@grandcure.care"
                  className="h-11 w-full rounded-full border border-zinc-200 bg-zinc-100 px-4 text-sm text-zinc-800"
                />
              </label>

              <label className="space-y-1">
                <span className="text-xs font-semibold text-zinc-700">Phone Number</span>
                <input
                  defaultValue="+1 (555) 123-4567"
                  className="h-11 w-full rounded-full border border-zinc-200 bg-zinc-100 px-4 text-sm text-zinc-800"
                />
              </label>

              <label className="space-y-1">
                <span className="text-xs font-semibold text-zinc-700">Date of Birth</span>
                <input
                  defaultValue="05/12/1988"
                  className="h-11 w-full rounded-full border border-zinc-200 bg-zinc-100 px-4 text-sm text-zinc-800"
                />
              </label>

              <label className="space-y-1 sm:col-span-2">
                <span className="text-xs font-semibold text-zinc-700">Residential Address</span>
                <input
                  defaultValue="123 Care Street, Suite 400, New York, NY"
                  className="h-11 w-full rounded-full border border-zinc-200 bg-zinc-100 px-4 text-sm text-zinc-800"
                />
              </label>
            </form>
          </article>

          <article className="rounded-4xl border border-[#d8e4ee] bg-white p-6 shadow-soft sm:p-7">
            <h2 className="font-display text-4xl font-extrabold tracking-tight text-zinc-900">
              Upload Verification Documents
            </h2>
            <p className="mt-2 text-sm text-secondary">
              Required for activation. High-resolution scans preferred.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-dashed border-zinc-300 bg-zinc-50 p-4">
                <p className="text-sm font-bold text-zinc-900">Driver&apos;s License</p>
                <p className="mt-1 text-xs text-secondary">PDF, JPG, PNG up to 10MB</p>
                <button
                  type="button"
                  className="mt-4 inline-flex h-9 items-center rounded-full bg-primary px-4 text-xs font-semibold text-white"
                >
                  Select File
                </button>
              </div>

              <div className="rounded-3xl border border-dashed border-zinc-300 bg-zinc-50 p-4">
                <p className="text-sm font-bold text-zinc-900">CNA Certificate</p>
                <p className="mt-1 text-xs text-secondary">Proof of accreditation required</p>
                <button
                  type="button"
                  className="mt-4 inline-flex h-9 items-center rounded-full bg-[#9de8f2] px-4 text-xs font-semibold text-[#0f5b73]"
                >
                  Select File
                </button>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
              <button type="button" className="px-4 text-sm font-semibold text-secondary hover:text-zinc-800">
                Discard Changes
              </button>
              <button
                type="button"
                className="inline-flex h-11 items-center rounded-full bg-primary px-6 text-sm font-bold text-white shadow-soft hover:bg-[#004d80]"
              >
                Save & Submit for Review
              </button>
            </div>
          </article>
        </div>
      </section>
    </CaregiverShell>
  );
}
