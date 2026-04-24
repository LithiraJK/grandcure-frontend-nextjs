import { Suspense } from "react";

import RequestsPageClient from "./RequestsPageClient";

function RequestsPageFallback() {
	return (
		<main className="min-h-screen bg-neutral px-4 py-8 sm:px-6 lg:px-8">
			<section className="mx-auto max-w-6xl rounded-3xl border border-zinc-200 bg-white p-6 shadow-soft">
				<p className="text-sm font-medium text-secondary">Loading requests...</p>
			</section>
		</main>
	);
}

export default function CaregiverRequestsPage() {
	return (
		<Suspense fallback={<RequestsPageFallback />}>
			<RequestsPageClient />
		</Suspense>
	);
}
