import { apiClient } from "@/api/client";
import type { SignupPayload, SignupResponse } from "@/features/auth-customer/types";

export const authApi = {
  signup: (payload: SignupPayload) => apiClient.post<SignupResponse>("/auth/signup", payload),
};
