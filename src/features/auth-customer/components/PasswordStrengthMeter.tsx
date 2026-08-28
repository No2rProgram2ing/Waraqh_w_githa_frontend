import { motion } from "framer-motion";
import { clsx } from "clsx";
import { usePasswordStrength } from "@/features/auth-customer/hooks/usePasswordStrength";

interface PasswordStrengthMeterProps {
  password: string;
}

const strengthColor: Record<string, string> = {
  weak: "bg-red-400",
  medium: "bg-amber-400",
  strong: "bg-brand-olive-600",
};

/** Three-segment strength bar shown beneath the password field. */
export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const { strength, score } = usePasswordStrength(password);
  const filledSegments = password.length === 0 ? 0 : Math.min(3, Math.max(1, Math.ceil((score / 5) * 3)));

  return (
    <div className="flex gap-1.5" role="progressbar" aria-valuenow={score} aria-valuemin={0} aria-valuemax={5}>
      {[0, 1, 2].map((segment) => (
        <div key={segment} className="h-1 flex-1 overflow-hidden rounded-full bg-brand-border">
          <motion.div
            initial={false}
            animate={{ width: segment < filledSegments ? "100%" : "0%" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={clsx("h-full rounded-full", strengthColor[strength])}
          />
        </div>
      ))}
    </div>
  );
}
