/** Raw values collected from the signup form. */
export interface SignupFormValues {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  acceptedTerms: boolean;
}

/** Payload shape sent to the API (no client-only fields like confirmPassword). */
export interface SignupPayload {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

/** Successful signup response from the API. */
export interface SignupResponse {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
}

/** Normalized shape for a failed signup request. */
export interface SignupError {
  message: string;
  fieldErrors?: Partial<Record<keyof SignupPayload, string>>;
}

export type PasswordStrength = "weak" | "medium" | "strong";
