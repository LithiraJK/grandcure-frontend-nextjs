type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type RequestOptions = {
  method?: HttpMethod;
  body?: unknown;
  headers?: HeadersInit;
  signal?: AbortSignal;
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

function resolveBaseUrl() {
  if (!API_BASE_URL) {
    throw new Error("Missing NEXT_PUBLIC_API_BASE_URL environment variable.");
  }

  return API_BASE_URL;
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

  const response = await fetch(`${baseUrl}${path}`, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    signal: options.signal,
    cache: "no-store",
  });

  return parseResponse<T>(response);
}
