import { PatientShell } from "@/components/dashboard/patient/PatientShell";

export default function PatientSchedulePage() {
	return (
		<PatientShell activeItem="schedule" pageSubtitle="Patient Schedule">
			<section className="mx-auto max-w-6xl rounded-3xl bg-white/90 p-8 shadow-soft">
				<h1 className="font-display text-3xl font-extrabold tracking-tight text-zinc-900">
					Patient Schedule
				</h1>
				<p className="mt-2 text-sm text-secondary">Schedule workspace is coming soon.</p>
			</section>
		</PatientShell>
	);
}
