import { useMemo } from "react";
import type { PasswordStrength } from "@/features/auth-customer/types";

/**
 * Scores a password across a few simple heuristics (length, casing,
 * digits, symbols) and buckets it into a strength label used to
 * drive the 3-segment strength meter.
 */
export function usePasswordStrength(password: string): { strength: PasswordStrength; score: number } {
  return useMemo(() => {
    let score = 0;

    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    let strength: PasswordStrength = "weak";
    if (score >= 4) strength = "strong";
    else if (score >= 2) strength = "medium";

    return { strength, score };
  }, [password]);
}
