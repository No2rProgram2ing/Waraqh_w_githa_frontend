import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { AuthLayout } from "@/layouts/AuthLayout";
import { AuthHeroPanel } from "@/features/auth-customer/components/AuthHeroPanel";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { EyeIcon, EyeOffIcon } from "@/components/ui/icons";
import logo from '@/assets/images/Warqah & Jitha Logo.png'

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      transition={{ duration: 0.3 }}
    >
      <AuthLayout panel={<AuthHeroPanel />}>
        <div className="mx-auto w-full max-w-md flex flex-col items-center">
          
          {/* Logo / الشعار */}
          <div className="mb-6 flex justify-center">
            <img 
              src={logo}
              alt="ورقة وجذع" 
              className="h-20 w-auto object-contain" 
            />
          </div>

          {/* Heading / العناوين */}
          <h1 className="text-3xl font-bold text-brand-olive-700 text-center">
            أهلاً بعودتك
          </h1>
          <p className="mt-2 text-sm text-brand-muted text-center">
            سجل دخولك لتجربة استثنائية مع الحرف اليدوية
          </p>

          {/* Form / النموذج */}
          <form className="mt-8 w-full flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
            
            {/* Email or Phone Input */}
            <Input 
              label="البريد الإلكتروني أو رقم الهاتف" 
              type="text" 
              placeholder="example@email.com" 
              autoComplete="username"
            />
            
            {/* Password Input */}
            <div className="flex flex-col gap-1.5">
              <Input 
                label="كلمة المرور" 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                autoComplete="current-password"
                iconPosition="left"
                icon={
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="pointer-events-auto text-brand-muted hover:text-brand-ink transition-colors"
                    aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                }
              />
              
              {/* Forgot Password Link */}
              <div className="flex justify-start">
                <Link 
                  to="/forgot-password" 
                  className="text-xs text-brand-olive-700 underline underline-offset-2 hover:text-brand-olive-900 transition-colors"
                >
                  نسيت كلمة المرور؟
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <Button type="submit" fullWidth className="mt-2">
              تسجيل الدخول
            </Button>
          </form>

          {/* Footer Link */}
          <p className="mt-8 text-center text-sm text-brand-muted">
            ليس لديك حساب؟{" "}
            <Link to="/signup" className="font-semibold text-brand-ink hover:underline">
              إنشاء حساب جديد
            </Link>
          </p>
        </div>
      </AuthLayout>
    </motion.div>
  );
}