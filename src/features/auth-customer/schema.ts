import { z } from "zod";

export const signupSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "الاسم الكامل يجب أن يتكون من حرفين على الأقل"),
    email: z.string().trim().min(1, "البريد الإلكتروني مطلوب").email("صيغة البريد الإلكتروني غير صحيحة"),
    phoneCountryCode: z.string().trim().min(1, "رمز الدولة مطلوب"),
    phone: z
      .string()
      .trim()
      .min(1, "رقم الهاتف مطلوب")
      .regex(/^\+?[0-9\s]{8,15}$/, "رقم الهاتف غير صحيح"),
    password: z.string().min(8, "أدخل 8 أحرف على الأقل"),
    confirmPassword: z.string().min(1, "تأكيد كلمة المرور مطلوب"),
    acceptedTerms: z
      .boolean()
      .refine((value) => value === true, "يجب الموافقة على الشروط والأحكام وسياسة الخصوصية"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirmPassword"],
  });

export type SignupSchema = z.infer<typeof signupSchema>;

// ---------------------------------------------------------------------------
// Login schema
// ---------------------------------------------------------------------------
export const loginSchema = z.object({
  phone: z
    .string()
    .trim()
    .min(1, "رقم الهاتف مطلوب")
    .regex(/^\+?[0-9\s]{8,15}$/, "رقم الهاتف غير صحيح"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
});

export type LoginSchema = z.infer<typeof loginSchema>;
