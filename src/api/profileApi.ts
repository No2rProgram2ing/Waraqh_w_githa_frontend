import { customerApi } from "@/api/customerApi";

export interface UserProfileData {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatarUrl: string | null;
  joinedDate: string;
  isOnline: boolean;
}

export interface UpdateProfileParams {
  fullName: string;
  email: string;
  phone: string;
}

export interface UpdatePasswordParams {
  currentPassword: string;
  newPassword: string;
  confirmPassword?: string;
}

const PROFILE_ENDPOINT = "/customer/profile";
const PROFILE_PASSWORD_ENDPOINT = "/customer/profile/password";

const extractProfilePayload = (responseData: any) => {
  if (!responseData || typeof responseData !== "object") return {};

  return (
    responseData.user ??
    responseData.data ??
    responseData.profile ??
    responseData.customer ??
    responseData
  );
};

const normalizeProfile = (user: any): UserProfileData => ({
  id: String(user?.id ?? ""),
  fullName:
    user?.full_name ??
    user?.fullName ??
    user?.name ??
    user?.customer_name ??
    "",
  email: user?.email ?? "",
  phone: user?.phone ?? user?.phone_number ?? user?.mobile ?? "",
  avatarUrl: user?.avatar_url ?? user?.avatarUrl ?? null,
  joinedDate: user?.created_at
    ? new Date(user.created_at).toLocaleDateString("ar-EG", {
        month: "long",
        year: "numeric",
      })
    : "يناير 2023",
  isOnline: true,
});

export const profileApi = {
  getProfile: async (): Promise<UserProfileData> => {
    const response = await customerApi.get(PROFILE_ENDPOINT);
    const profile = extractProfilePayload(response.data);
    return normalizeProfile(profile);
  },

  updateProfile: async (params: UpdateProfileParams): Promise<UserProfileData> => {
    const response = await customerApi.put(PROFILE_ENDPOINT, {
      full_name: params.fullName,
      email: params.email,
      phone: params.phone,
    });

    const profile = extractProfilePayload(response.data);
    return normalizeProfile(profile);
  },

  updatePassword: async (
    params: UpdatePasswordParams,
  ): Promise<{ success: boolean; message: string }> => {
    const confirmation = params.confirmPassword ?? params.newPassword;

    const response = await customerApi.put(PROFILE_PASSWORD_ENDPOINT, {
      current_password: params.currentPassword,
      password: params.newPassword,
      password_confirmation: confirmation,
    });

    return {
      success: true,
      message: response.data?.message ?? "تم تحديث كلمة المرور بنجاح",
    };
  },
};
