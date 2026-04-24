import { PatientShell } from "@/components/dashboard/patient/PatientShell";

export default function PatientRequestPage() {
	return (
		<PatientShell activeItem="requests" pageSubtitle="Patient Requests">
			<section className="mx-auto max-w-6xl rounded-3xl bg-white/90 p-8 shadow-soft">
				<h1 className="font-display text-3xl font-extrabold tracking-tight text-zinc-900">
					Patient Requests
				</h1>
				<p className="mt-2 text-sm text-secondary">Request workspace is coming soon.</p>
			</section>
		</PatientShell>
	);
}
