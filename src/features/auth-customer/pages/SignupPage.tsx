import { motion } from "framer-motion";
import { AuthLayout } from "@/layouts/AuthLayout";
import { AuthHeroPanel } from "@/features/auth-customer/components/AuthHeroPanel";
import { SignupForm } from "@/features/auth-customer/components/SignupForm";

export function SignupPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <AuthLayout panel={<AuthHeroPanel />}>
        <SignupForm />
      </AuthLayout>
    </motion.div>
  );
}
