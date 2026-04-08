"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { AdminShell } from "@/components/dashboard/admin/AdminShell";
import {
  AssignmentsTable,
  type AdminAssignment,
} from "@/components/dashboard/admin/AssignmentsTable";
import { ROUTES } from "@/lib/routes";
import { useAuthStore } from "@/store/useAuthStore";

function isAdminRole(role: string | undefined) {
  return (role ?? "").toUpperCase() === "ADMIN";
}

function parseAssignmentsPayload(payload: unknown): AdminAssignment[] {
  if (Array.isArray(payload)) {
    return payload as AdminAssignment[];
  }

  if (
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    Array.isArray((payload as { data?: unknown }).data)
  ) {
    return (payload as { data: AdminAssignment[] }).data;
  }

  return [];
}

export default function AdminReviewsPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const role = useAuthStore((state) => state.user?.role);
  const [assignments, setAssignments] = useState<AdminAssignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !isAdminRole(role)) {
      router.replace(ROUTES.login);
      return;
    }

    let isMounted = true;

    const fetchAssignments = async () => {
      setIsLoading(true);

      try {
        const response = await axios.get("/api/backend/admin/assignments");
        if (isMounted) {
          setAssignments(parseAssignmentsPayload(response.data));
        }
      } catch {
        if (isMounted) {
          setAssignments([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void fetchAssignments();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, role, router]);

  if (!isAuthenticated || !isAdminRole(role)) {
    return null;
  }

  return (
    <AdminShell
      activeItem="reviews"
      title="Review Management Activity"
      subtitle="Track assignment lifecycle updates and operational request reviews."
    >
      {isLoading ? (
        <div className="rounded-3xl border border-[#d8e4ee] bg-white p-6 text-sm text-secondary shadow-soft">
          Loading assignment activity...
        </div>
      ) : (
        <AssignmentsTable assignments={assignments} />
      )}
    </AdminShell>
  );
}
