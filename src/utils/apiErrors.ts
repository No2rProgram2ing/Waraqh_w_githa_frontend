import type { AxiosError } from "axios";

/**
 * Extracts field-level validation messages from a Laravel 422 response.
 *
 * Laravel returns errors in this shape:
 * { message: "...", errors: { field_name: ["message 1", "message 2"] } }
 *
 * Returns a flat map: { fieldName: "first error message" }
 * Keys are normalised from snake_case → camelCase so they match form field names.
 */
export function extractFieldErrors(error: unknown): Record<string, string> {
  const axiosError = error as AxiosError<{
    errors?: Record<string, string[]>;
  }>;

  const rawErrors = axiosError?.response?.data?.errors;
  if (!rawErrors || typeof rawErrors !== "object") return {};

  const result: Record<string, string> = {};

  for (const [key, messages] of Object.entries(rawErrors)) {
    if (Array.isArray(messages) && messages.length > 0) {
      // Normalise snake_case → camelCase  (full_name → fullName)
      const camelKey = key.replace(/_([a-z])/g, (_, letter: string) =>
        letter.toUpperCase(),
      );
      result[camelKey] = messages[0];
      // Also keep the original snake_case key for safety
      result[key] = messages[0];
    }
  }

  return result;
}

/**
 * Extracts the top-level human-readable error message.
 * Falls back to the provided fallback string if no message is found.
 */
export function extractMessage(
  error: unknown,
  fallback = "حدث خطأ غير متوقع، حاول مرة أخرى",
): string {
  const axiosError = error as AxiosError<{ message?: string }>;
  return axiosError?.response?.data?.message ?? (error as Error)?.message ?? fallback;
}

/** Returns true when the Axios error is a Laravel validation error (422). */
export function isValidationError(error: unknown): boolean {
  return (error as AxiosError)?.response?.status === 422;
}
