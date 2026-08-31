/** Raw values collected from the signup form. */
export interface SignupFormValues {
  fullName: string;
  email: string;
  phone: string;
  phoneCountryCode?: string;
  password: string;
  confirmPassword: string;
  acceptedTerms: boolean;
}

/** Payload shape sent to the API (no client-only fields like acceptedTerms). */
export interface SignupPayload {
  fullName: string;
  email: string;
  phone: string;
  phoneCountryCode?: string;
  password: string;
  confirmPassword: string;
}

/** Successful signup response from the API. */
export interface SignupResponse {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
  token?: string;
}

/** Normalized shape for a failed signup request. */
export interface SignupError {
  message: string;
  fieldErrors?: Partial<Record<keyof SignupPayload, string>>;
}

export type PasswordStrength = "weak" | "medium" | "strong";
