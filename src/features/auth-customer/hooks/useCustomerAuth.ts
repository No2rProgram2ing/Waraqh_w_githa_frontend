import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/api/auth";
import { ApiError } from "@/api/client";

/**
 * Hook for generating a verification code (OTP) for a contact value.
 */
export function useGenerateCustomerVerification() {
  return useMutation<void, ApiError, { purpose: string; contact_value: string }>({
    mutationFn: (payload) => authApi.generateVerification(payload),
  });
}

/**
 * Hook for verifying a code/token for a contact value.
 */
export function useCustomerVerification() {
  return useMutation<void, ApiError, { purpose: string; contact_value: string; code_or_token: string }>({
    mutationFn: (payload) => authApi.verifyVerification(payload),
  });
}

/**
 * Hook for resetting customer password.
 * Accepts either snake_case or camelCase keys coming from forms.
 */
export function useCustomerResetPassword() {
  return useMutation<void, ApiError, any>({
    mutationFn: (payload: any) =>
      authApi.resetPassword({
        email: payload.email,
        codeOrToken: payload.code_or_token ?? payload.codeOrToken,
        password: payload.password,
      }),
  });
}
