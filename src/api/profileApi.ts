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

export interface UpdateAvatarParams {
  file: File;
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

const extractAvatarUrl = (value: any): string | null => {
  if (!value || typeof value !== "object") return null;

  const candidates = [
    value.avatar_url,
    value.avatarUrl,
    value.avatar,
    value.image_url,
    value.imageUrl,
    value.photo_url,
    value.photoUrl,
    value.url,
    value.profile_image,
    value.profileImage,
    value.user?.avatar_url,
    value.user?.avatarUrl,
    value.user?.avatar,
    value.user?.image_url,
    value.user?.imageUrl,
    value.user?.photo_url,
    value.user?.photoUrl,
    value.data?.avatar_url,
    value.data?.avatarUrl,
    value.data?.avatar,
    value.data?.image_url,
    value.data?.imageUrl,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate;
    }
  }

  return null;
};

const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("فشل تحويل الصورة إلى بيانات قابلة للتخزين."));
    reader.readAsDataURL(file);
  });

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
  avatarUrl: extractAvatarUrl(user),
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

  updateAvatar: async (file: File): Promise<UserProfileData> => {
    const formData = new FormData();
    formData.append("_method", "PUT");
    formData.append("avatar", file);

    const response = await customerApi.post(PROFILE_ENDPOINT, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    const profile = extractProfilePayload(response.data);
    const normalized = normalizeProfile(profile);

    if (!normalized.avatarUrl) {
      const fallbackAvatar = extractAvatarUrl(response.data) ?? (await fileToDataUrl(file));
      return {
        ...normalized,
        avatarUrl: fallbackAvatar,
      };
    }

    return normalized;
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
