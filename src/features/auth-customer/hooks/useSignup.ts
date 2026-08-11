import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/api/auth";
import { ApiError } from "@/api/client";
import type { SignupPayload, SignupResponse } from "@/features/auth-customer/types";

/**
 * Wraps the signup mutation. Components consume `mutate`/`mutateAsync`,
 * `isPending`, and `error` — no direct API or fetch calls in the UI layer.
 */
export function useSignup() {
  return useMutation<SignupResponse, ApiError, SignupPayload>({
    mutationFn: authApi.signup,
  });
}
