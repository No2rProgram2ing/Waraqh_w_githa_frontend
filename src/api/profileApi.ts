export interface UserProfileData {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatarUrl: string;
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
}

// Initial state matching the Figma Screen 1
const mockProfile: UserProfileData = {
  id: "user-101",
  fullName: "أحمد اليمني",
  email: "ahmed@example.com",
  phone: "+967 777 000 000",
  avatarUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80",
  joinedDate: "يناير 2023",
  isOnline: true,
};

export const profileApi = {
  getProfile: async (): Promise<UserProfileData> => {
    // Simulate network latency
    await new Promise((res) => setTimeout(res, 300));
    return { ...mockProfile };
  },

  updateProfile: async (params: UpdateProfileParams): Promise<UserProfileData> => {
    await new Promise((res) => setTimeout(res, 500));
    mockProfile.fullName = params.fullName;
    mockProfile.email = params.email;
    mockProfile.phone = params.phone;
    return { ...mockProfile };
  },

  updatePassword: async (_params: UpdatePasswordParams): Promise<{ success: boolean; message: string }> => {
    await new Promise((res) => setTimeout(res, 600));
    return {
      success: true,
      message: "تم تحديث كلمة المرور بنجاح",
    };
  },
};
