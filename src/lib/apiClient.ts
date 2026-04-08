/**
 * API Client
 * - Centralized function for making API requests to the backend.
 * - Handles request construction, response parsing, and error handling.
 * - Supports request timeouts and external abort signals for better UX.
 * - Designed to work with the backend proxy route for seamless API communication.
 * - Provides a consistent interface for services to interact with the backend API.
 */

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type RequestOptions = {
  method?: HttpMethod;
  body?: unknown;
  headers?: HeadersInit;
  signal?: AbortSignal;
  timeoutMs?: number;
};

type ApiSuccessResponse<T> = {
  statusCode: number;
  message: string;
  data: T;
};

type ApiErrorResponse = {
  statusCode?: number;
  message?: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const DEFAULT_REQUEST_TIMEOUT_MS = 10_000;
const AUTH_TOKEN_STORAGE_KEY = "gc_access_token";

function resolveBaseUrl() {
  return API_BASE_URL ?? "/api/backend";
}

function getAuthToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
}

async function parseResponse<T>(response: Response): Promise<ApiSuccessResponse<T>> {
  const payload = (await response.json().catch(() => null)) as
    | ApiSuccessResponse<T>
    | ApiErrorResponse
    | null;

  if (!response.ok) {
    const message = payload && "message" in payload && payload.message
      ? payload.message
      : "Request failed. Please try again.";
    throw new Error(message);
  }

  if (!payload || !("data" in payload)) {
    throw new Error("Invalid API response shape.");
  }

  return payload as ApiSuccessResponse<T>;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<ApiSuccessResponse<T>> {
  const baseUrl = resolveBaseUrl();
  const authToken = getAuthToken();

  const abortController = new AbortController();
  const timeoutMs = options.timeoutMs ?? DEFAULT_REQUEST_TIMEOUT_MS;
  const timeoutId = setTimeout(() => {
    abortController.abort();
  }, timeoutMs);

  const onExternalAbort = () => {
    abortController.abort();
  };

  if (options.signal) {
    if (options.signal.aborted) {
      abortController.abort();
    } else {
      options.signal.addEventListener("abort", onExternalAbort, { once: true });
    }
  }

  try {
    const response = await fetch(`${baseUrl}${path}`, {
      method: options.method ?? "GET",
      headers: {
        "Content-Type": "application/json",
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        ...(options.headers ?? {}),
      },
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
      signal: abortController.signal,
      cache: "no-store",
    });

    return parseResponse<T>(response);
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timed out. Please try again.");
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);

    if (options.signal) {
      options.signal.removeEventListener("abort", onExternalAbort);
    }
  }
}
