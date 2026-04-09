import { create } from "zustand";

import axios from "axios";

export type AssignmentPriority = "URGENT" | "STANDARD" | "RECURRING";
export type AssignmentStatus =
  | "PENDING"
  | "ACCEPTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "REJECTED";

export type Assignment = {
  id: string;
  title: string;
  priority: AssignmentPriority;
  status: AssignmentStatus;
  patientName: string;
  patientAge: number;
  distanceMiles: number;
  address: string;
  note: string;
  etaLabel: string;
  fee: number;
  createdAtLabel: string;
};

type AssignmentState = {
  assignments: Assignment[];
  pendingAssignments: Assignment[];
  activeAssignments: Assignment[];
  historyAssignments: Assignment[];
  isLoading: boolean;
  fetchPending: () => Promise<void>;
  fetchCaregiverHistory: () => Promise<void>;
  fetchPendingRequests: () => Promise<void>;
  acceptAssignment: (assignmentId: string) => Promise<void>;
  startAssignment: (assignmentId: string) => Promise<void>;
  completeAssignment: (assignmentId: string) => Promise<void>;
  rejectAssignment: (assignmentId: string) => Promise<void>;
};

type ToastTone = "success" | "error";

const BACKEND_BASE_URL = "/api/backend";

const ACTIVE_STATUSES: AssignmentStatus[] = ["ACCEPTED", "IN_PROGRESS"];

function emitToast(message: string, tone: ToastTone) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("gc:toast", {
        detail: {
          message,
          tone,
        },
      }),
    );
  }

  if (tone === "error") {
    console.error(message);
    return;
  }

  console.info(message);
}

function getAuthHeaders() {
  if (typeof window === "undefined") {
    return undefined;
  }

  const token = window.localStorage.getItem("gc_access_token");
  if (!token) {
    return undefined;
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

function getEnvelopeData<T>(payload: unknown): T {
  if (!payload || typeof payload !== "object") {
    return [] as T;
  }

  if ("data" in payload) {
    return (payload as { data: T }).data;
  }

  return payload as T;
}

function toNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function formatCreatedAtLabel(value: unknown): string {
  if (typeof value !== "string" || !value.trim()) {
    return "Recently";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function normalizePriority(value: unknown): AssignmentPriority {
  const normalized = String(value ?? "STANDARD").toUpperCase();
  if (normalized === "URGENT") {
    return "URGENT";
  }

  if (normalized === "RECURRING") {
    return "RECURRING";
  }

  return "STANDARD";
}

function normalizeStatus(value: unknown): AssignmentStatus {
  const normalized = String(value ?? "PENDING").toUpperCase();
  if (normalized === "ACCEPTED") {
    return "ACCEPTED";
  }

  if (normalized === "IN_PROGRESS") {
    return "IN_PROGRESS";
  }

  if (normalized === "COMPLETED") {
    return "COMPLETED";
  }

  if (normalized === "REJECTED") {
    return "REJECTED";
  }

  return "PENDING";
}

function normalizeAssignment(raw: unknown): Assignment {
  const item = (raw ?? {}) as Record<string, unknown>;
  const id = String(item.id ?? item.assignmentId ?? item._id ?? crypto.randomUUID());
  const patientName =
    typeof item.patientName === "string" && item.patientName.trim()
      ? item.patientName
      : "Patient";

  return {
    id,
    title:
      typeof item.title === "string" && item.title.trim()
        ? item.title
        : "Care Assignment",
    priority: normalizePriority(item.priority),
    status: normalizeStatus(item.status),
    patientName,
    patientAge: toNumber(item.patientAge, 0),
    distanceMiles: toNumber(item.distanceMiles, 0),
    address:
      typeof item.address === "string" && item.address.trim()
        ? item.address
        : "Address not available",
    note:
      typeof item.note === "string" && item.note.trim()
        ? item.note
        : "No additional notes.",
    etaLabel:
      typeof item.etaLabel === "string" && item.etaLabel.trim()
        ? item.etaLabel
        : "ETA pending",
    fee: toNumber(item.fee, 0),
    createdAtLabel: formatCreatedAtLabel(item.createdAt),
  };
}

function normalizeAssignmentList(payload: unknown): Assignment[] {
  const rawList = getEnvelopeData<unknown[]>(payload);
  if (!Array.isArray(rawList)) {
    return [];
  }

  return rawList.map(normalizeAssignment);
}

function deriveActiveAssignments(
  pendingAssignments: Assignment[],
  historyAssignments: Assignment[],
): Assignment[] {
  const byId = new Map<string, Assignment>();

  [...pendingAssignments, ...historyAssignments].forEach((assignment) => {
    if (ACTIVE_STATUSES.includes(assignment.status)) {
      byId.set(assignment.id, assignment);
    }
  });

  return Array.from(byId.values());
}

export const useAssignmentStore = create<AssignmentState>((set, get) => ({
  assignments: [],
  pendingAssignments: [],
  activeAssignments: [],
  historyAssignments: [],
  isLoading: false,

  fetchPending: async () => {
    set({ isLoading: true });

    try {
      const response = await axios.get(`${BACKEND_BASE_URL}/assignments/pending`, {
        headers: getAuthHeaders(),
      });

      const pendingAssignments = normalizeAssignmentList(response.data);
      const historyAssignments = get().historyAssignments;

      set({
        assignments: pendingAssignments,
        pendingAssignments,
        activeAssignments: deriveActiveAssignments(pendingAssignments, historyAssignments),
      });
    } catch (error) {
      emitToast("Failed to load pending assignments.", "error");
      console.error(error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchCaregiverHistory: async () => {
    set({ isLoading: true });

    try {
      const response = await axios.get(
        `${BACKEND_BASE_URL}/assignments/history/caregiver`,
        {
          headers: getAuthHeaders(),
        },
      );

      const historyAssignments = normalizeAssignmentList(response.data);
      const pendingAssignments = get().pendingAssignments;

      set({
        historyAssignments,
        activeAssignments: deriveActiveAssignments(pendingAssignments, historyAssignments),
      });
    } catch (error) {
      emitToast("Failed to load assignment history.", "error");
      console.error(error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchPendingRequests: async () => {
    await get().fetchPending();
  },

  acceptAssignment: async (assignmentId) => {
    set({ isLoading: true });

    try {
      await axios.patch(
        `${BACKEND_BASE_URL}/assignments/${assignmentId}/accept`,
        {},
        { headers: getAuthHeaders() },
      );
      emitToast("Assignment accepted.", "success");

      await Promise.all([get().fetchPending(), get().fetchCaregiverHistory()]);
    } catch (error) {
      emitToast("Failed to accept assignment.", "error");
      console.error(error);
    } finally {
      set({ isLoading: false });
    }
  },

  startAssignment: async (assignmentId) => {
    set({ isLoading: true });

    try {
      await axios.patch(
        `${BACKEND_BASE_URL}/assignments/${assignmentId}/start`,
        {},
        { headers: getAuthHeaders() },
      );
      emitToast("Assignment started.", "success");

      await Promise.all([get().fetchPending(), get().fetchCaregiverHistory()]);
    } catch (error) {
      emitToast("Failed to start assignment.", "error");
      console.error(error);
    } finally {
      set({ isLoading: false });
    }
  },

  completeAssignment: async (assignmentId) => {
    set({ isLoading: true });

    try {
      await axios.patch(
        `${BACKEND_BASE_URL}/assignments/${assignmentId}/complete`,
        {},
        { headers: getAuthHeaders() },
      );
      emitToast("Assignment completed.", "success");

      await Promise.all([get().fetchPending(), get().fetchCaregiverHistory()]);
    } catch (error) {
      emitToast("Failed to complete assignment.", "error");
      console.error(error);
    } finally {
      set({ isLoading: false });
    }
  },

  rejectAssignment: async (assignmentId) => {
    set((state) => {
      const pendingAssignments = state.pendingAssignments.filter(
        (assignment) => assignment.id !== assignmentId,
      );

      return {
        assignments: pendingAssignments,
        pendingAssignments,
        activeAssignments: deriveActiveAssignments(
          pendingAssignments,
          state.historyAssignments,
        ),
      };
    });

    emitToast("Assignment rejected.", "success");
  },
}));
