import { AuthSessionGuard } from "@/components/auth/AuthSessionGuard";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-neutral px-5 py-10 sm:px-8">
      <AuthSessionGuard>
        <DashboardOverview />
      </AuthSessionGuard>
    </main>
  );
}
