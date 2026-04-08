import { create } from "zustand";

import { apiRequest } from "@/lib/apiClient";
import { getCoordinates } from "@/utils/geolocation";

type ProfileData = Record<string, unknown>;
const AUTH_TOKEN_STORAGE_KEY = "gc_access_token";

type UpdateProfileFormData = {
  address: string;
} & Record<string, unknown>;

type DocumentsUploadResponse = {
  idDocumentUrl?: string;
  certDocumentUrl?: string;
};

type ProfileState = {
  profile: ProfileData | null;
  isLoading: boolean;
  fetchProfile: () => Promise<void>;
  updateCaregiverProfile: (
    formData: UpdateProfileFormData,
    idFile?: File,
    certFile?: File,
  ) => Promise<void>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function extractErrorMessage(payload: unknown): string {
  if (isRecord(payload) && typeof payload.message === "string" && payload.message.trim()) {
    return payload.message;
  }

  return "Request failed. Please try again.";
}

function extractResponseData<T>(payload: unknown): T {
  if (!isRecord(payload) || !("data" in payload)) {
    throw new Error("Invalid API response shape.");
  }

  return payload.data as T;
}

async function uploadDocuments(idFile?: File, certFile?: File): Promise<DocumentsUploadResponse> {
  if (!idFile && !certFile) {
    return {};
  }

  const multipartForm = new FormData();

  if (idFile) {
    multipartForm.append("idDocument", idFile);
  }

  if (certFile) {
    multipartForm.append("certDocument", certFile);
  }

  const authToken = typeof window === "undefined"
    ? null
    : window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);

  const response = await fetch("/api/backend/users/profile/documents", {
    method: "POST",
    headers: {
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
    body: multipartForm,
    cache: "no-store",
  });

  const payload = (await response.json().catch(() => null)) as unknown;

  if (!response.ok) {
    throw new Error(extractErrorMessage(payload));
  }

  return extractResponseData<DocumentsUploadResponse>(payload);
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  isLoading: false,

  fetchProfile: async () => {
    set({ isLoading: true });

    try {
      const response = await apiRequest<ProfileData>("/users/profile", {
        method: "GET",
      });

      set({ profile: response.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateCaregiverProfile: async (formData, idFile, certFile) => {
    set({ isLoading: true });

    try {
      const documents = await uploadDocuments(idFile, certFile);
      const coordinates = await getCoordinates(formData.address);

      const payload: Record<string, unknown> = {
        ...formData,
        ...(documents.idDocumentUrl ? { idDocumentUrl: documents.idDocumentUrl } : {}),
        ...(documents.certDocumentUrl ? { certDocumentUrl: documents.certDocumentUrl } : {}),
        latitude: coordinates?.latitude ?? null,
        longitude: coordinates?.longitude ?? null,
      };

      const response = await apiRequest<ProfileData>("/users/profile", {
        method: "PATCH",
        body: payload,
      });

      set({ profile: response.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
}));
