export function getGoogleLoginUrl(): string {
  const configuredUrl = import.meta.env.VITE_GOOGLE_LOGIN_URL as string | undefined;
  const fallbackBase = import.meta.env.VITE_API_BASE_URL as string | undefined;

  if (configuredUrl && configuredUrl.trim()) {
    return configuredUrl.trim();
  }

  if (fallbackBase && fallbackBase.trim()) {
    return `${fallbackBase.replace(/\/api\/?$/, "")}/api/auth/google/redirect`;
  }

  return "/api/auth/google/redirect";
}

export function redirectToGoogleLogin(): void {
  const url = getGoogleLoginUrl();
  if (!url || url === "#") {
    throw new Error("Google login URL is not configured.");
  }

  window.location.assign(url);
}
