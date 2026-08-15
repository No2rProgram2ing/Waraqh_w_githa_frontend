/**
 * Thin fetch wrapper shared by every feature's API module.
 * Keeps base URL, headers, and error normalization in one place so
 * components never call `fetch` directly.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

export class ApiError extends Error {
  status: number;
  fieldErrors?: Record<string, string>;

  constructor(message: string, status: number, fieldErrors?: Record<string, string>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}

async function request<TResponse>(path: string, options: RequestOptions = {}): Promise<TResponse> {
  const { body, headers, ...rest } = options;

  const response = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    let fieldErrors: Record<string, string> | undefined;

    try {
      const data = await response.json();
      message = data?.message ?? message;
      fieldErrors = data?.fieldErrors;
    } catch {
      // Response had no JSON body — fall back to the generic message.
    }

    throw new ApiError(message, response.status, fieldErrors);
  }

  // 204 No Content
  if (response.status === 204) {
    return undefined as TResponse;
  }

  return (await response.json()) as TResponse;
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) => request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "POST", body }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PUT", body }),
  delete: <T>(path: string, options?: RequestOptions) => request<T>(path, { ...options, method: "DELETE" }),
};
