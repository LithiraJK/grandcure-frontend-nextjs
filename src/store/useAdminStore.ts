import { create } from "zustand";

import axios from "axios";

const BACKEND_BASE_URL = "/api/backend";
const AUTH_TOKEN_STORAGE_KEY = "gc_access_token";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
  isBlocked: boolean;
};

export type AdminAssignment = {
  id: string;
  requestDate: string;
  patientName: string;
  caregiverName: string | null;
  serviceType: string;
  status: string;
};

type AdminState = {
  users: AdminUser[];
  allAssignments: AdminAssignment[];
  isLoading: boolean;
  fetchAllUsers: () => Promise<void>;
  toggleVerify: (userId: string) => Promise<void>;
  toggleBlock: (userId: string) => Promise<void>;
  fetchAllAssignments: () => Promise<void>;
};

function getAuthHeaders() {
  if (typeof window === "undefined") {
    return undefined;
  }

  const token = window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);

  if (!token) {
    return undefined;
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

function getEnvelopeData<T>(payload: unknown): T {
  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as { data: T }).data;
  }

  return payload as T;
}

function normalizeUsers(payload: unknown): AdminUser[] {
  const raw = getEnvelopeData<unknown>(payload);

  if (!Array.isArray(raw)) {
    return [];
  }

  return raw.map((item) => {
    const row = (item ?? {}) as Record<string, unknown>;

    return {
      id: String(row.id ?? row.userId ?? row._id ?? ""),
      name: typeof row.name === "string" ? row.name : "Unknown User",
      email:
        typeof row.email === "string"
          ? row.email
          : typeof row.contact === "string"
            ? row.contact
            : "",
      role: typeof row.role === "string" ? row.role : "PATIENT",
      isVerified: Boolean(row.isVerified),
      isBlocked: Boolean(row.isBlocked),
    };
  });
}

function normalizeAssignments(payload: unknown): AdminAssignment[] {
  const raw = getEnvelopeData<unknown>(payload);

  if (!Array.isArray(raw)) {
    return [];
  }

  return raw.map((item) => {
    const row = (item ?? {}) as Record<string, unknown>;

    return {
      id: String(row.id ?? row.assignmentId ?? row._id ?? ""),
      requestDate:
        typeof row.requestDate === "string"
          ? row.requestDate
          : typeof row.date === "string"
            ? row.date
            : "",
      patientName:
        typeof row.patientName === "string" && row.patientName.trim()
          ? row.patientName
          : "Unknown Patient",
      caregiverName:
        typeof row.caregiverName === "string" && row.caregiverName.trim()
          ? row.caregiverName
          : null,
      serviceType:
        typeof row.serviceType === "string" && row.serviceType.trim()
          ? row.serviceType
          : typeof row.type === "string"
            ? row.type
            : "General Care",
      status: typeof row.status === "string" ? row.status : "PENDING",
    };
  });
}

export const useAdminStore = create<AdminState>((set, get) => ({
  users: [],
  allAssignments: [],
  isLoading: false,

  fetchAllUsers: async () => {
    set({ isLoading: true });

    try {
      const response = await axios.get(`${BACKEND_BASE_URL}/admin/users`, {
        headers: getAuthHeaders(),
      });

      set({ users: normalizeUsers(response.data) });
    } finally {
      set({ isLoading: false });
    }
  },

  toggleVerify: async (userId) => {
    const previousUsers = get().users;

    const targetUser = previousUsers.find((user) => user.id === userId);

    if (!targetUser) {
      return;
    }

    const nextVerifiedState = !targetUser.isVerified;

    set({
      users: previousUsers.map((user) =>
        user.id === userId ? { ...user, isVerified: nextVerifiedState } : user,
      ),
    });

    try {
      await axios.patch(
        `${BACKEND_BASE_URL}/admin/users/${userId}/verify`,
        {},
        { headers: getAuthHeaders() },
      );
    } catch (error) {
      set({ users: previousUsers });
      throw error;
    }
  },

  toggleBlock: async (userId) => {
    const previousUsers = get().users;

    const targetUser = previousUsers.find((user) => user.id === userId);

    if (!targetUser) {
      return;
    }

    const nextBlockedState = !targetUser.isBlocked;

    set({
      users: previousUsers.map((user) =>
        user.id === userId ? { ...user, isBlocked: nextBlockedState } : user,
      ),
    });

    try {
      await axios.patch(
        `${BACKEND_BASE_URL}/admin/users/${userId}/block`,
        {},
        { headers: getAuthHeaders() },
      );
    } catch (error) {
      set({ users: previousUsers });
      throw error;
    }
  },

  fetchAllAssignments: async () => {
    set({ isLoading: true });

    try {
      const response = await axios.get(`${BACKEND_BASE_URL}/admin/assignments`, {
        headers: getAuthHeaders(),
      });

      set({ allAssignments: normalizeAssignments(response.data) });
    } finally {
      set({ isLoading: false });
    }
  },
}));
