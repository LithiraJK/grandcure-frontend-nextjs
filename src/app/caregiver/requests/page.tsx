"use client";

import {
	CalendarClock,
	CheckCircle2,
	Clock3,
	Loader2,
	MapPin,
	PlayCircle,
	RefreshCcw,
	Search,
	UserRound,
	X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { CaregiverShell } from "@/components/dashboard/caregiver/CaregiverShell";
import { StandardRequestCard } from "@/components/dashboard/caregiver/StandardRequestCard";
import { UrgentRequestCard } from "@/components/dashboard/caregiver/UrgentRequestCard";
import { ROUTES } from "@/lib/routes";
import { type Assignment, useAssignmentStore } from "@/store/useAssignmentStore";
import { useAuthStore } from "@/store/useAuthStore";

type RequestTab = "pending" | "active" | "history";
type PriorityFilter = "ALL" | "URGENT" | "STANDARD" | "RECURRING";

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
	const [searchQuery, setSearchQuery] = useState("");
	const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("ALL");
	const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);

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

	const filteredAssignments = useMemo(() => {
		const query = searchQuery.trim().toLowerCase();

		return activeList.filter((assignment) => {
			const byPriority = priorityFilter === "ALL" || assignment.priority === priorityFilter;
			if (!byPriority) {
				return false;
			}

			if (!query) {
				return true;
			}

			const content = [
				assignment.title,
				assignment.patientName,
				assignment.address,
				assignment.note,
				assignment.status,
			].join(" ").toLowerCase();

			return content.includes(query);
		});
	}, [activeList, priorityFilter, searchQuery]);

	const selectedAssignment = useMemo(() => {
		if (!selectedAssignmentId) {
			return null;
		}

		return (
			pendingAssignments.find((assignment) => assignment.id === selectedAssignmentId) ??
			activeAssignments.find((assignment) => assignment.id === selectedAssignmentId) ??
			historyAssignments.find((assignment) => assignment.id === selectedAssignmentId) ??
			null
		);
	}, [activeAssignments, historyAssignments, pendingAssignments, selectedAssignmentId]);

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

				<div className="grid gap-3 rounded-3xl border border-[#d8e4ee] bg-white p-3 shadow-soft md:grid-cols-[minmax(0,1fr)_auto] md:p-4">
					<label className="relative block">
						<Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
						<input
							type="search"
							value={searchQuery}
							onChange={(event) => setSearchQuery(event.target.value)}
							placeholder="Search by patient, title, address, or notes"
							className="h-10 w-full rounded-2xl border border-[#d9e7f2] bg-[#f6fafd] pl-10 pr-3 text-sm text-zinc-900 outline-none transition placeholder:text-secondary focus:border-[#8ec7e8] focus:bg-white"
						/>
					</label>

					<div className="inline-flex flex-wrap items-center gap-1.5 rounded-2xl bg-[#eef5fb] p-1.5">
						{(["ALL", "URGENT", "STANDARD", "RECURRING"] as const).map((option) => (
							<button
								key={option}
								type="button"
								onClick={() => setPriorityFilter(option)}
								className={[
									"rounded-xl px-3 py-2 text-xs font-semibold transition",
									priorityFilter === option
										? "bg-white text-primary shadow-sm"
										: "text-secondary hover:text-zinc-800",
								].join(" ")}
							>
								{option}
							</button>
						))}
					</div>
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
				) : filteredAssignments.length === 0 ? (
					<div className="rounded-3xl border border-[#d8e4ee] bg-white p-6 text-sm text-secondary shadow-soft">
						No {activeTab} assignments match your current filters.
					</div>
				) : (
					<div className="space-y-4">
						{activeTab === "pending"
							? filteredAssignments.map((assignment) =>
									assignment.priority === "URGENT" ? (
										<div key={assignment.id} className="space-y-2">
											<UrgentRequestCard assignment={assignment} />
											<div className="flex justify-end">
												<button
													type="button"
													onClick={() => setSelectedAssignmentId(assignment.id)}
													className="inline-flex h-9 items-center rounded-full border border-primary/20 bg-[#edf4fa] px-4 text-xs font-semibold text-primary transition hover:bg-[#dbeaf7]"
												>
													View Details
												</button>
											</div>
										</div>
									) : (
										<StandardRequestCard
											key={assignment.id}
											assignment={assignment}
											onViewDetails={(assignmentId) => setSelectedAssignmentId(assignmentId)}
										/>
									),
								)
							: filteredAssignments.map((assignment) => (
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

				{selectedAssignment ? (
					<div className="fixed inset-0 z-40 flex items-center justify-center bg-zinc-900/45 p-4">
						<div className="w-full max-w-xl rounded-3xl border border-[#cde1ef] bg-white p-6 shadow-2xl">
							<div className="flex items-start justify-between gap-3">
								<div>
									<p className="text-xs font-black uppercase tracking-widest text-primary">
										Request Details
									</p>
									<h2 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-zinc-900">
										{selectedAssignment.title}
									</h2>
								</div>
								<button
									type="button"
									onClick={() => setSelectedAssignmentId(null)}
									className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#dbe8f1] text-zinc-600 transition hover:bg-zinc-100"
									aria-label="Close request details"
								>
									<X className="h-4 w-4" />
								</button>
							</div>

							<div className="mt-5 grid gap-3 sm:grid-cols-2">
								<div className="rounded-2xl bg-[#f4f9fd] p-4">
									<p className="text-[11px] font-bold uppercase tracking-widest text-secondary">Patient</p>
									<p className="mt-1 inline-flex items-center gap-2 text-sm font-semibold text-zinc-900">
										<UserRound className="h-4 w-4 text-primary" />
										{selectedAssignment.patientName}
									</p>
									<p className="mt-2 text-xs text-secondary">Age {selectedAssignment.patientAge}</p>
								</div>

								<div className="rounded-2xl bg-[#f4f9fd] p-4">
									<p className="text-[11px] font-bold uppercase tracking-widest text-secondary">Location</p>
									<p className="mt-1 inline-flex items-start gap-2 text-sm text-zinc-900">
										<MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
										{selectedAssignment.address}
									</p>
									<p className="mt-2 text-xs text-secondary">{selectedAssignment.distanceMiles} miles away</p>
								</div>
							</div>

							<div className="mt-3 rounded-2xl bg-[#f8fbfe] p-4">
								<p className="text-[11px] font-bold uppercase tracking-widest text-secondary">Notes</p>
								<p className="mt-1 text-sm text-zinc-800">{selectedAssignment.note || "No additional notes."}</p>
							</div>

							<div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm">
								<span className="font-semibold text-secondary">{selectedAssignment.createdAtLabel}</span>
								<span className="rounded-full bg-[#eaf4fb] px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
									{selectedAssignment.status.replace("_", " ")}
								</span>
								<span className="text-base font-extrabold text-zinc-900">{formatFee(selectedAssignment.fee)}</span>
							</div>
						</div>
					</div>
				) : null}
			</section>
		</CaregiverShell>
	);
}
