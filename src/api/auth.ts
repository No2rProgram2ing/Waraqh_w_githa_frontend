import { customerApi } from "@/api/customerApi";
import { customerAuthStorage } from "@/features/auth-customer/services/customerAuthStorage";
import type { SignupPayload, SignupResponse } from "@/features/auth-customer/types";

export interface LoginCredentials {
  phone: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    phone: string | null;
    avatar?: string | null;
    avatarUrl?: string | null;
  };
}

const normalizeUser = (user: any) => {
  const avatar =
    user?.avatar ??
    user?.avatar_url ??
    user?.avatarUrl ??
    user?.image_url ??
    user?.imageUrl ??
    user?.avatar_data_url ??
    user?.avatarDataUrl ??
    null;

  return {
    id: String(user?.id ?? ""),
    fullName: user?.full_name ?? user?.fullName ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? null,
    avatar,
    avatarUrl: avatar,
  };
};

export const authApi = {
  signup: async (payload: SignupPayload): Promise<SignupResponse> => {
    const { data } = await customerApi.post("/register", {
      full_name: payload.fullName,
      email: payload.email,
      phone_country_code: payload.phoneCountryCode ?? '',
      phone: payload.phone,
      password: payload.password,
      password_confirmation: payload.confirmPassword,
    });

    // Backend returns a plain text token under `token` key
    if (data?.token) {
      customerAuthStorage.setToken(data.token);
    }

    return {
      id: String(data.user?.id ?? ""),
      fullName: data.user?.full_name ?? payload.fullName,
      email: data.user?.email ?? payload.email,
      createdAt: data.user?.created_at ?? new Date().toISOString(),
      token: data.token,
    };
  },


  login: async (payload: LoginCredentials): Promise<LoginResponse> => {
    const { data } = await customerApi.post("/customer/login", {
      phone: payload.phone,
      password: payload.password,
    });

    if (data?.token) {
      customerAuthStorage.setToken(data.token);
    }

    return {
      message: data.message,
      token: data.token,
      user: normalizeUser(data.user),
    };
  },


  logout: async (): Promise<{ message: string }> => {
    const { data } = await customerApi.post("/customer/logout");
    customerAuthStorage.clearToken();
    return data;
  },

  forgotPassword: async (email: string) =>
    customerApi.post("/customer/password/forgot", { email }),

  resetPassword: async (payload: { email: string; codeOrToken: string; password: string }) =>
    customerApi.post("/customer/password/reset", {
      email: payload.email,
      code_or_token: payload.codeOrToken,
      password: payload.password,
      password_confirmation: payload.password,
    }),

  // Generate verification code (OTP) for email/phone
  generateVerification: async (payload: { purpose: string; contact_value: string }) =>
    customerApi.post("/customer/verifications/generate", {
      purpose: payload.purpose,
      contact_value: payload.contact_value,
    }),

  // Verify code/token
  verifyVerification: async (payload: { purpose: string; contact_value: string; code_or_token: string }) =>
    customerApi.post("/customer/verifications/verify", {
      purpose: payload.purpose,
      contact_value: payload.contact_value,
      code_or_token: payload.code_or_token,
    }),
};
