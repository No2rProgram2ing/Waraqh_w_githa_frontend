import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/api/auth";
import { ApiError } from "@/api/client";
import type { LoginCredentials, LoginResponse } from "@/api/auth";

/**
 * Wraps the customer login mutation.
 * Components consume `mutate`/`mutateAsync`, `isPending`, and `error`.
 */
export function useLogin() {
  return useMutation<LoginResponse, ApiError, LoginCredentials>({
    mutationFn: authApi.login,
  });
}
