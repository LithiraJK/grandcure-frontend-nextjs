"use client";

import { CalendarClock, CheckCircle2, Clock3, Loader2, PlayCircle, RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { CaregiverShell } from "@/components/dashboard/caregiver/CaregiverShell";
import { StandardRequestCard } from "@/components/dashboard/caregiver/StandardRequestCard";
import { UrgentRequestCard } from "@/components/dashboard/caregiver/UrgentRequestCard";
import { ROUTES } from "@/lib/routes";
import { type Assignment, useAssignmentStore } from "@/store/useAssignmentStore";
import { useAuthStore } from "@/store/useAuthStore";

type RequestTab = "pending" | "active" | "history";

function isCaregiverRole(role: string | undefined) {
	if (!role) {
		return false;
	}

	const normalized = role.toUpperCase();
	return normalized === "CARE_GIVER" || normalized === "CAREGIVER";
}

function formatFee(amount: number) {
	return amount.toLocaleString("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 2,
	});
}

function AssignmentTimelineCard({
	assignment,
	onStart,
	onComplete,
}: {
	assignment: Assignment;
	onStart?: (assignmentId: string) => void;
	onComplete?: (assignmentId: string) => void;
}) {
	return (
		<article className="rounded-3xl border border-[#d8e4ee] bg-white p-5 shadow-soft sm:p-6">
			<div className="flex flex-wrap items-center justify-between gap-2">
				<h3 className="font-display text-xl font-extrabold tracking-tight text-zinc-900">
					{assignment.title}
				</h3>
				<span className="rounded-full bg-[#eaf4fb] px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-primary">
					{assignment.status.replace("_", " ")}
				</span>
			</div>

			<p className="mt-2 text-sm text-secondary">
				{assignment.patientName} • {assignment.address}
			</p>

			<div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-zinc-700">
				<span className="inline-flex items-center gap-1">
					<Clock3 className="h-4 w-4 text-primary" />
					{assignment.etaLabel}
				</span>
				<span className="inline-flex items-center gap-1 font-semibold text-primary">
					<CalendarClock className="h-4 w-4" />
					{assignment.createdAtLabel}
				</span>
				<span className="font-extrabold text-zinc-900">{formatFee(assignment.fee)}</span>
			</div>

			{assignment.note ? <p className="mt-4 text-sm text-secondary">{assignment.note}</p> : null}

			<div className="mt-5 flex flex-wrap gap-3">
				{assignment.status === "ACCEPTED" && onStart ? (
					<button
						type="button"
						onClick={() => onStart(assignment.id)}
						className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-white transition hover:bg-[#004d80]"
					>
						<PlayCircle className="h-4 w-4" />
						Start Assignment
					</button>
				) : null}

				{assignment.status === "IN_PROGRESS" && onComplete ? (
					<button
						type="button"
						onClick={() => onComplete(assignment.id)}
						className="inline-flex h-10 items-center gap-2 rounded-full bg-[#0a7c66] px-5 text-sm font-bold text-white transition hover:bg-[#086652]"
					>
						<CheckCircle2 className="h-4 w-4" />
						Mark Completed
					</button>
				) : null}
			</div>
		</article>
	);
}

export default function CaregiverRequestsPage() {
	const router = useRouter();
	const [activeTab, setActiveTab] = useState<RequestTab>("pending");

	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const userRole = useAuthStore((state) => state.user?.role);

	const isLoading = useAssignmentStore((state) => state.isLoading);
	const pendingAssignments = useAssignmentStore((state) => state.pendingAssignments);
	const activeAssignments = useAssignmentStore((state) => state.activeAssignments);
	const historyAssignments = useAssignmentStore((state) => state.historyAssignments);

	const fetchPending = useAssignmentStore((state) => state.fetchPending);
	const fetchCaregiverHistory = useAssignmentStore((state) => state.fetchCaregiverHistory);
	const startAssignment = useAssignmentStore((state) => state.startAssignment);
	const completeAssignment = useAssignmentStore((state) => state.completeAssignment);

	useEffect(() => {
		if (!isAuthenticated || !isCaregiverRole(userRole)) {
			router.replace(ROUTES.login);
		}
	}, [isAuthenticated, router, userRole]);

	useEffect(() => {
		void Promise.all([fetchPending(), fetchCaregiverHistory()]);
	}, [fetchCaregiverHistory, fetchPending]);

	const activeList = useMemo(() => {
		if (activeTab === "pending") {
			return pendingAssignments;
		}

		if (activeTab === "active") {
			return activeAssignments;
		}

		return historyAssignments;
	}, [activeAssignments, activeTab, historyAssignments, pendingAssignments]);

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
		<CaregiverShell activeItem="requests" pageSubtitle="Request Pipeline">
			<section className="space-y-5">
				<div className="flex flex-wrap items-center justify-between gap-3">
					<div>
						<h1 className="font-display text-2xl font-extrabold tracking-tight text-zinc-900">
							Care Requests
						</h1>
						<p className="mt-1 text-sm text-secondary">
							Track pending offers, active jobs, and completed request history.
						</p>
					</div>

					<button
						type="button"
						onClick={() => {
							void Promise.all([fetchPending(), fetchCaregiverHistory()]);
						}}
						className="inline-flex h-10 items-center gap-2 rounded-full border border-primary/20 bg-[#edf4fa] px-4 text-sm font-semibold text-primary transition hover:bg-[#dbeaf7]"
					>
						<RefreshCcw className="h-4 w-4" />
						Refresh
					</button>
				</div>

				<div className="inline-flex flex-wrap gap-2 rounded-2xl bg-[#eef5fb] p-1.5">
					<button
						type="button"
						onClick={() => setActiveTab("pending")}
						className={[
							"rounded-xl px-4 py-2 text-sm font-semibold transition",
							activeTab === "pending" ? "bg-white text-primary shadow-sm" : "text-secondary hover:text-zinc-800",
						].join(" ")}
					>
						Pending ({pendingAssignments.length})
					</button>
					<button
						type="button"
						onClick={() => setActiveTab("active")}
						className={[
							"rounded-xl px-4 py-2 text-sm font-semibold transition",
							activeTab === "active" ? "bg-white text-primary shadow-sm" : "text-secondary hover:text-zinc-800",
						].join(" ")}
					>
						Active ({activeAssignments.length})
					</button>
					<button
						type="button"
						onClick={() => setActiveTab("history")}
						className={[
							"rounded-xl px-4 py-2 text-sm font-semibold transition",
							activeTab === "history" ? "bg-white text-primary shadow-sm" : "text-secondary hover:text-zinc-800",
						].join(" ")}
					>
						History ({historyAssignments.length})
					</button>
				</div>

				{isLoading ? (
					<div className="inline-flex items-center gap-2 rounded-2xl border border-[#d8e4ee] bg-white px-4 py-3 text-sm text-secondary shadow-soft">
						<Loader2 className="h-4 w-4 animate-spin" />
						Loading assignments...
					</div>
				) : activeList.length === 0 ? (
					<div className="rounded-3xl border border-[#d8e4ee] bg-white p-6 text-sm text-secondary shadow-soft">
						No {activeTab} assignments available.
					</div>
				) : (
					<div className="space-y-4">
						{activeTab === "pending"
							? activeList.map((assignment) =>
									assignment.priority === "URGENT" ? (
										<UrgentRequestCard key={assignment.id} assignment={assignment} />
									) : (
										<StandardRequestCard key={assignment.id} assignment={assignment} />
									),
								)
							: activeList.map((assignment) => (
									<AssignmentTimelineCard
										key={assignment.id}
										assignment={assignment}
										onStart={(assignmentId) => {
											void startAssignment(assignmentId);
										}}
										onComplete={(assignmentId) => {
											void completeAssignment(assignmentId);
										}}
									/>
								))}
					</div>
				)}
			</section>
		</CaregiverShell>
	);
}
