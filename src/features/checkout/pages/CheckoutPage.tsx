import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Banknote, Check, CreditCard, LockKeyhole, MapPin, Smartphone, WalletCards } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { CatalogLayout } from "@/layouts/CatalogLayout";
import { useCartStore } from "@/features/cart/stores/cartStore";
import { ROUTES } from "@/routes/paths";

const formatPrice = (price: number) => `${price.toLocaleString("ar-SA")} ر.س`;
const paymentMethods = [
  { id: "card", label: "بطاقة ائتمانية", icon: CreditCard },
  { id: "mada", label: "مدى", icon: WalletCards },
  { id: "apple", label: "Apple Pay", icon: Smartphone },
  { id: "jeeb", label: "جيب", icon: WalletCards },
  { id: "kareemi", label: "كريمي", icon: WalletCards },
  { id: "jawali", label: "جوالي", icon: Smartphone },
  { id: "cash", label: "الدفع عند الاستلام", icon: Banknote },
] as const;

const checkoutSchema = z.object({
  fullName: z.string().trim().min(3, "يرجى إدخال الاسم الكامل"),
  phone: z.string().trim().regex(/^(05|5)\d{8}$/, "أدخل رقم جوال سعودي صحيح"),
  address: z.string().trim().min(10, "يرجى إدخال عنوان الشحن بالتفصيل"),
  cardNumber: z.string().optional(),
  expiry: z.string().optional(),
  cvv: z.string().optional(),
  walletPhone: z.string().optional(),
});
type CheckoutValues = z.infer<typeof checkoutSchema>;

export function CheckoutPage() {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 30 : 0;
  const total = subtotal + shipping;
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CheckoutValues>({ resolver: zodResolver(checkoutSchema), mode: "onBlur" });
  const requiresCard = paymentMethod === "card" || paymentMethod === "mada";
  const fieldClass = (hasError: boolean) => `mt-2 w-full rounded-[7px] border bg-white px-4 py-3 text-sm text-[#211f1b] outline-none focus:border-[#3e522c] ${hasError ? "border-[#a04a3a]" : "border-[#b9a88e]"}`;

  const onSubmit = (values: CheckoutValues) => {
    if (requiresCard && (!values.cardNumber || !/^\d{16}$/.test(values.cardNumber))) return;
    const orderNumber = `WRQ-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    clearCart();
    navigate(ROUTES.checkoutSuccess, { state: { orderNumber, total, item: items[0] } });
  };

  if (items.length === 0) return <CatalogLayout><main dir="rtl" className="flex min-h-[calc(100vh-20rem)] flex-col items-center justify-center bg-[#f4f1eb] px-5 text-center"><h1 className="text-3xl font-extrabold text-[#3e522c]">لا يمكن إتمام الطلب</h1><p className="mt-3 text-sm text-[#504b44]">أضف منتجات إلى السلة أولاً.</p><Link to={ROUTES.products} className="mt-6 rounded-sm bg-[#52663c] px-6 py-3 text-sm font-extrabold text-white">العودة إلى المنتجات</Link></main></CatalogLayout>;

  return <CatalogLayout><motion.main initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} dir="rtl" className="bg-[#f4f1eb] px-5 py-12 text-[#211f1b] sm:py-16"><div className="mx-auto max-w-6xl"><div className="mb-8 flex items-end justify-between"><div><p className="text-xs font-extrabold tracking-[0.16em] text-[#9b6a3d]">إتمام الدفع</p><h1 className="mt-2 text-3xl font-extrabold text-[#3e522c] sm:text-4xl">إتمام الطلب</h1><p className="mt-2 text-sm text-[#504b44]">يرجى مراجعة تفاصيل طلبك وإكمال عملية الدفع بأمان.</p></div><Link to={ROUTES.cart} className="text-sm font-bold text-[#603e27] hover:text-[#3e522c]">العودة للسلة</Link></div>
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-[1fr_300px] lg:items-start"><div className="space-y-5"><section className="border border-[#ded8cf] bg-[#fbfaf7] p-5 shadow-sm"><div className="flex items-center gap-2 border-b border-[#e5e0d8] pb-4"><MapPin className="size-5 text-[#52663c]" /><h2 className="text-lg font-extrabold text-[#3e522c]">معلومات الشحن</h2></div><div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="text-sm font-extrabold text-[#302c27]">الاسم الكامل<input {...register("fullName")} placeholder="مثال: أحمد محمد" className={fieldClass(Boolean(errors.fullName))} />{errors.fullName && <span className="mt-1 block text-xs font-normal text-[#a04a3a]">{errors.fullName.message}</span>}</label><label className="text-sm font-extrabold text-[#302c27]">رقم الجوال<input {...register("phone")} type="tel" dir="ltr" placeholder="05XXXXXXXX" className={fieldClass(Boolean(errors.phone))} />{errors.phone && <span className="mt-1 block text-xs font-normal text-[#a04a3a]">{errors.phone.message}</span>}</label></div><label className="mt-4 block text-sm font-extrabold text-[#302c27]">عنوان الشحن<textarea {...register("address")} rows={3} placeholder="المدينة، الحي، الشارع، رقم المنزل" className={`${fieldClass(Boolean(errors.address))} resize-none leading-7`} />{errors.address && <span className="mt-1 block text-xs font-normal text-[#a04a3a]">{errors.address.message}</span>}</label></section>
    <section className="border border-[#ded8cf] bg-[#fbfaf7] p-5 shadow-sm"><div className="flex items-center gap-2 border-b border-[#e5e0d8] pb-4"><CreditCard className="size-5 text-[#52663c]" /><h2 className="text-lg font-extrabold text-[#3e522c]">طريقة الدفع</h2></div><div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">{paymentMethods.map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => setPaymentMethod(id)} className={`flex min-h-24 flex-col items-center justify-center gap-2 rounded-[7px] border text-xs font-extrabold transition hover:-translate-y-0.5 ${paymentMethod === id ? "border-[#52663c] bg-[#e5eddc] text-[#3e522c]" : "border-[#c8c0b4] bg-white text-[#302c27] hover:border-[#8e704f]"}`}><Icon className="size-6" />{label}</button>)}</div>{requiresCard && <div className="mt-6 border-t border-[#e5e0d8] pt-5"><label className="block text-sm font-extrabold text-[#302c27]">رقم البطاقة<input {...register("cardNumber", { required: "يرجى إدخال رقم البطاقة", pattern: { value: /^\d{16}$/, message: "أدخل 16 رقماً" } })} maxLength={16} inputMode="numeric" placeholder="•••• •••• •••• ••••" className={fieldClass(Boolean(errors.cardNumber))} />{errors.cardNumber && <span className="mt-1 block text-xs font-normal text-[#a04a3a]">{errors.cardNumber.message}</span>}</label><div className="mt-4 grid gap-4 sm:grid-cols-2"><label className="text-sm font-extrabold text-[#302c27]">تاريخ الانتهاء<input {...register("expiry", { required: "يرجى إدخال تاريخ الانتهاء", pattern: { value: /^(0[1-9]|1[0-2])\/\d{2}$/, message: "استخدم صيغة MM/YY" } })} placeholder="MM/YY" className={fieldClass(Boolean(errors.expiry))} />{errors.expiry && <span className="mt-1 block text-xs font-normal text-[#a04a3a]">{errors.expiry.message}</span>}</label><label className="text-sm font-extrabold text-[#302c27]">رمز التحقق CVV<input {...register("cvv", { required: "يرجى إدخال رمز التحقق", pattern: { value: /^\d{3,4}$/, message: "أدخل 3 أو 4 أرقام" } })} maxLength={4} inputMode="numeric" placeholder="•••" className={fieldClass(Boolean(errors.cvv))} />{errors.cvv && <span className="mt-1 block text-xs font-normal text-[#a04a3a]">{errors.cvv.message}</span>}</label></div></div>}{!requiresCard && paymentMethod !== "cash" && <div className="mt-5"><label className="block text-sm font-extrabold text-[#302c27]">رقم الجوال المرتبط بالمحفظة<input {...register("walletPhone", { required: "يرجى إدخال رقم الجوال", pattern: { value: /^(05|5)\d{8}$/, message: "أدخل رقم جوال سعودي صحيح" } })} type="tel" dir="ltr" placeholder="05XXXXXXXX" className={fieldClass(Boolean(errors.walletPhone))} />{errors.walletPhone && <span className="mt-1 block text-xs font-normal text-[#a04a3a]">{errors.walletPhone.message}</span>}</label></div>}</section></div>
    <aside className="border border-[#ded8cf] bg-[#eeece7] p-5 shadow-sm lg:sticky lg:top-24"><h2 className="text-xl font-extrabold text-[#3e522c]">ملخص الطلب</h2><div className="mt-5 space-y-3 border-b border-[#d8d3ca] pb-5">{items.map((item) => <div key={item.id} className="flex items-center gap-3"><img src={item.image} alt={item.name} className="size-14 object-cover" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-[#302c27]">{item.name}</p><p className="mt-1 text-xs text-[#504b44]">{item.quantity}x · {formatPrice(item.price)}</p></div></div>)}</div><div className="mt-5 space-y-3 text-sm"><div className="flex justify-between"><span className="text-[#504b44]">المجموع الفرعي</span><strong>{formatPrice(subtotal)}</strong></div><div className="flex justify-between"><span className="text-[#504b44]">تكلفة الشحن</span><strong>{formatPrice(shipping)}</strong></div></div><div className="mt-5 flex items-center justify-between border-t border-[#d8d3ca] pt-5 text-lg font-extrabold text-[#3e522c]"><span>الإجمالي الكلي</span><span>{formatPrice(total)}</span></div><button type="submit" disabled={isSubmitting} className="mt-6 flex w-full items-center justify-center gap-2 rounded-sm bg-[#52663c] px-5 py-4 text-sm font-extrabold text-white shadow-[0_12px_20px_-12px_rgba(62,82,44,0.85)] transition hover:bg-[#3e522c] disabled:cursor-not-allowed disabled:bg-[#aeb6a2]"><LockKeyhole className="size-4" />تأكيد الدفع الآمن</button><div className="mt-5 flex items-center justify-center gap-2 border-t border-[#d8d3ca] pt-4 text-[10px] text-[#504b44]"><Check className="size-4 text-[#52663c]" />بياناتك محمية ومشفرة</div></aside></form></div></motion.main></CatalogLayout>;
}
