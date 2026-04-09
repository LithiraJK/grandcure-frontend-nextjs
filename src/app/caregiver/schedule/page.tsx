"use client";

import { CalendarClock } from "lucide-react";

import { CaregiverShell } from "@/components/dashboard/caregiver/CaregiverShell";

export default function CaregiverSchedulePage() {
	return (
		<CaregiverShell activeItem="schedule" pageSubtitle="Schedule Planner">
			<section className="rounded-3xl border border-[#d8e4ee] bg-white p-6 shadow-soft">
				<p className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
					<CalendarClock className="h-4 w-4" />
					Schedule tools are coming soon.
				</p>
				<p className="mt-2 text-sm text-secondary">
					Use the Requests workspace to manage assignments until calendar workflows are enabled.
				</p>
			</section>
		</CaregiverShell>
	);
}
