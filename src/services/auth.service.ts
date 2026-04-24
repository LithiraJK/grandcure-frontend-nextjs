import { apiRequest } from "@/lib/apiClient";

/**
 * Auth Service
 
 - Talks to the backend authentication API.
 - Sends login + register requests.
 - Returns backend response data.
 - Converts unknown errors into clean Error objects.
 
 */

export type ApiUserRole = "PATIENT" | "CARE_GIVER";

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponseData = {
  access_token: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  role: ApiUserRole;
};

export type RegisterResponseData = {
  id: number;
  name: string;
  email: string;
  password: string;
  role: ApiUserRole;
  isBlock: boolean;
  createdAt: string;
};

function normalizeError(error: unknown): Error {
  if (error instanceof Error && error.message) {
    return error;
  }

  return new Error("Something went wrong. Please try again.");
}

export async function login(payload: LoginPayload): Promise<LoginResponseData> {
  try {
    const response = await apiRequest<LoginResponseData>("/auth/login", {
      method: "POST",
      body: payload,
    });

    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
}

export async function register(payload: RegisterPayload): Promise<RegisterResponseData> {
  try {
    const response = await apiRequest<RegisterResponseData>("/auth/register", {
      method: "POST",
      body: payload,
    });

    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
}
