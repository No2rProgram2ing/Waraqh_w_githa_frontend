import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  Banknote,
  Check,
  CreditCard,
  LockKeyhole,
  MapPin,
  Smartphone,
  WalletCards,
  Lock,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { CatalogLayout } from "@/layouts/CatalogLayout";
import { useCartStore } from "@/features/cart/stores/cartStore";
import { CartReservationTimer } from "@/features/cart/components/CartReservationTimer";
import { ROUTES } from "@/routes/paths";
import { addressesApi } from "@/api/addresses";
import { ordersApi } from "@/api/ordersApi";
import type { AddressItem } from "@/features/addresses/types";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { cartApi } from "@/api/cartApi";
import { getProductImage } from "@/features/products/data/productImages";
import jawaliLogo from "@/assets/images/جوالي.png";
import jeebLogo from "@/assets/images/جيب.png";
import kuraimiLogo from "@/assets/images/كريمي.png";
const formatPrice = (price: number) => `${price.toLocaleString("ar-SA")} ر.س`;

function formatAddress(address: AddressItem): string {
  return [address.city, address.district, address.street, address.postal_code]
    .filter(Boolean)
    .join("، ");
}

function resolveImageUrl(value: string | null | undefined): string | null {
  if (!value?.trim()) return null;
  const imagePath = value.trim();
  if (/^(https?:|data:|blob:)/i.test(imagePath)) return imagePath;

  const configuredApiBase = String(import.meta.env.VITE_API_BASE_URL ?? "").trim().replace(/\/+$/, "");
  const apiOrigin = configuredApiBase.replace(/\/api(?:\/v\d+)?$/i, "");
  const normalizedPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  return apiOrigin ? `${apiOrigin}${normalizedPath}` : normalizedPath;
}

const paymentMethods = [
  { id: "jeeb", label: "جيب", icon: jeebLogo },
  { id: "kareemi", label: "الكريمي", icon: kuraimiLogo },
  { id: "jawali", label: "جوالي", icon: jawaliLogo },
] as const;

const checkoutSchema = z.object({
  fullName: z.string().trim().min(3, "يرجى إدخال الاسم الكامل"),
  phone: z.string().trim().regex(/^(77|73|71|78|70)\d{7}$/, "أدخل رقم جوال يمني صحيح"),
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
  const isReservationExpired = useCartStore((state) => state.isReservationExpired);
  const renewReservation = useCartStore((state) => state.renewReservation);

  const [paymentMethod, setPaymentMethod] = useState("jeeb");
  const [addresses, setAddresses] = useState<AddressItem[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const shippingFee = 0;
  const total = subtotal + shippingFee;

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    mode: "onBlur",
  });

  const requiresCard = paymentMethod === "card" || paymentMethod === "mada";
  const fieldClass = (hasError: boolean) =>
    `mt-2 w-full rounded-[7px] border bg-white px-4 py-3 text-sm text-[#211f1b] outline-none focus:border-[#3e522c] transition ${
      hasError ? "border-[#a04a3a]" : "border-[#b9a88e]"
    }`;

  useEffect(() => {
    void addressesApi
      .getAll()
      .then((loadedAddresses) => {
        setAddresses(loadedAddresses);
        const defaultAddress =
          loadedAddresses.find((address) => address.is_default) ??
          loadedAddresses[0];
        if (defaultAddress) {
          setSelectedAddressId(String(defaultAddress.id));
          setValue("fullName", defaultAddress.recipient_name ?? "");
          setValue("phone", defaultAddress.phone ?? "");
          setValue("address", formatAddress(defaultAddress));
        }
      })
      .catch((error) => console.error("Failed to load checkout addresses", error));
  }, []);

  const selectSavedAddress = (addressId: string) => {
    setSelectedAddressId(addressId);
    const selectedAddress = addresses.find((address) => String(address.id) === addressId);
    if (!selectedAddress) return;

    setValue("fullName", selectedAddress.recipient_name ?? "");
    setValue("phone", selectedAddress.phone ?? "");
    setValue("address", formatAddress(selectedAddress));
  };

  const onSubmit = async (values: CheckoutValues) => {
    if (requiresCard && (!values.cardNumber || !/^\d{16}$/.test(values.cardNumber))) {
      showErrorToast("يرجى إدخال رقم بطاقة صحيح مكون من 16 رقمًا");
      return;
    }

    // If reservation has expired, re-reserve first
    if (isReservationExpired) {
      const renewed = await renewReservation();
      if (!renewed) {
        showErrorToast("تعذر تجديد حجز المخزون، يرجى المحاولة مرة أخرى.");
        return;
      }
    }

    try {
      let orderAddressId = selectedAddressId;

      if (!orderAddressId) {
        const newAddress = await addressesApi.create({
          recipient_name: values.fullName,
          phone: values.phone,
          country: "اليمن",
          city: values.address.split("،")[0]?.trim() || values.address.trim(),
          district: values.address.split("،")[1]?.trim() || null,
          street: values.address.split("،").slice(2).join("،").trim() || values.address.trim(),
          is_default: addresses.length === 0,
        });
        orderAddressId = String(newAddress.id);
      }

      const response = await ordersApi.createOrder({
        address_id: orderAddressId,
        order_type: "ready_made",
        shipping_fee: shippingFee,
        items: items.map((item) => ({
          product_id: item.productId ?? item.id,
          quantity: item.quantity,
        })),
      });

      const order = response.data?.data ?? response.data;
      const orderId = order?.id;
      const orderNumber = order?.order_number ?? String(orderId ?? "");

      const whatsappMessage = `مرحبًا، أتممت طلبًا جديدًا من ورقة وجذع. رقم الطلب: ${orderNumber}. أرجو تأكيد الطلب.`;
      window.open(
        `https://wa.me/967778695735?text=${encodeURIComponent(whatsappMessage)}`,
        "_blank",
        "noopener,noreferrer",
      );

      await cartApi.clearCart();
      clearCart();
      showSuccessToast("تم تأكيد الطلب وحجز المنتجات بنجاح!");
      navigate(orderId ? `/orders/${orderId}` : ROUTES.orders, { replace: true });
    } catch (error) {
      console.error("Failed to create order", error);
      showErrorToast("تعذر حفظ الطلب، يرجى التحقق من العنوان والمحاولة مرة أخرى.");
    }
  };

  if (items.length === 0) {
    return (
      <CatalogLayout>
        <main
          dir="rtl"
          className="flex min-h-[calc(100vh-20rem)] flex-col items-center justify-center bg-[#f4f1eb] px-5 text-center"
        >
          <h1 className="text-3xl font-extrabold text-[#3e522c]">
            لا يمكن إتمام الطلب
          </h1>
          <p className="mt-3 text-sm text-[#504b44]">
            أضف منتجات إلى السلة أولاً ليتم حجزها لك.
          </p>
          <Link
            to={ROUTES.products}
            className="mt-6 rounded-xl bg-[#52663c] px-6 py-3 text-sm font-extrabold text-white shadow-sm transition hover:bg-[#3e522c]"
          >
            العودة إلى المنتجات
          </Link>
        </main>
      </CatalogLayout>
    );
  }

  return (
    <CatalogLayout>
      <motion.main
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        dir="rtl"
        className="bg-[#f4f1eb] px-4 py-10 text-[#211f1b] sm:px-6 sm:py-16"
      >
        <div className="mx-auto max-w-6xl">
          {/* Reservation Countdown Banner at Checkout */}
          <div className="mb-6">
            <CartReservationTimer variant="banner" />
          </div>

          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-xs font-extrabold tracking-[0.16em] text-[#9b6a3d]">
                إتمام الدفع وتأكيد الحجز
              </p>
              <h1 className="mt-2 text-3xl font-extrabold text-[#3e522c] sm:text-4xl">
                إتمام الطلب
              </h1>
              <p className="mt-2 text-sm text-[#504b44]">
                يرجى مراجعة تفاصيل طلبك وإكمال عملية الدفع قبل انتهاء مهلة حجز المخزون.
              </p>
            </div>
            <Link
              to={ROUTES.cart}
              className="text-sm font-bold text-[#603e27] hover:text-[#3e522c] transition"
            >
              العودة للسلة ←
            </Link>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start"
          >
            {/* Form Fields */}
            <div className="space-y-5">
              {/* Shipping Information Section */}
              <section className="rounded-2xl border border-[#ded8cf] bg-[#fbfaf7] p-5 shadow-sm">
                <div className="flex items-center gap-2 border-b border-[#e5e0d8] pb-4">
                  <MapPin className="size-5 text-[#52663c]" />
                  <h2 className="text-lg font-extrabold text-[#3e522c]">
                    معلومات الشحن
                  </h2>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <label className="text-sm font-extrabold text-[#302c27]">
                    الاسم الكامل
                    <input
                      {...register("fullName")}
                      placeholder="مثال: أحمد محمد"
                      className={fieldClass(Boolean(errors.fullName))}
                    />
                    {errors.fullName && (
                      <span className="mt-1 block text-xs font-normal text-[#a04a3a]">
                        {errors.fullName.message}
                      </span>
                    )}
                  </label>

                  <label className="text-sm font-extrabold text-[#302c27]">
                    رقم الجوال
                    <input
                      {...register("phone")}
                      type="tel"
                      dir="ltr"
                      placeholder="7XXXXXXXX"
                      className={fieldClass(Boolean(errors.phone))}
                    />
                    {errors.phone && (
                      <span className="mt-1 block text-xs font-normal text-[#a04a3a]">
                        {errors.phone.message}
                      </span>
                    )}
                  </label>
                </div>

                <label className="mt-4 block text-sm font-extrabold text-[#302c27]">
                  عنوان الشحن
                  <select
                    value={selectedAddressId}
                    onChange={(event) => {
                      const value = event.target.value;
                      if (value === "") {
                        setSelectedAddressId("");
                        setValue("address", "");
                      } else {
                        selectSavedAddress(value);
                      }
                    }}
                    className={fieldClass(!selectedAddressId)}
                  >
                    {addresses.map((address) => (
                      <option key={address.id} value={String(address.id)}>
                        {address.recipient_name} - {address.city}، {address.street}
                      </option>
                    ))}
                    <option value="">إضافة عنوان شحن جديد...</option>
                  </select>
                </label>

                <div className={selectedAddressId !== "" ? "hidden" : "mt-4"}>
                  <label className="block text-sm font-extrabold text-[#302c27]">
                    تفاصيل العنوان الجديد
                    <textarea
                      {...register("address")}
                      rows={3}
                      placeholder="المدينة، الحي، الشارع، رقم المنزل"
                      className={`${fieldClass(Boolean(errors.address))} resize-none leading-7 mt-2`}
                    />
                    {errors.address && (
                      <span className="mt-1 block text-xs font-normal text-[#a04a3a]">
                        {errors.address.message}
                      </span>
                    )}
                  </label>
                </div>
              </section>

              {/* Payment Methods Section */}
              <section className="rounded-2xl border border-[#ded8cf] bg-[#fbfaf7] p-5 shadow-sm">
                <div className="flex items-center gap-2 border-b border-[#e5e0d8] pb-4">
                  <CreditCard className="size-5 text-[#52663c]" />
                  <h2 className="text-lg font-extrabold text-[#3e522c]">
                    طريقة الدفع
                  </h2>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {paymentMethods.map(({ id, label, icon }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setPaymentMethod(id)}
                      className={`flex min-h-24 flex-col items-center justify-center gap-2 rounded-xl border text-xs font-extrabold transition hover:-translate-y-0.5 ${
                        paymentMethod === id
                          ? "border-[#52663c] bg-[#e5eddc] text-[#3e522c] shadow-xs"
                          : "border-[#c8c0b4] bg-white text-[#302c27] hover:border-[#8e704f]"
                      }`}
                    >
                      <img src={icon} alt={label} className="h-10 object-contain" />
                      {label}
                    </button>
                  ))}
                </div>

                {requiresCard && (
                  <div className="mt-6 border-t border-[#e5e0d8] pt-5">
                    <label className="block text-sm font-extrabold text-[#302c27]">
                      رقم البطاقة
                      <input
                        {...register("cardNumber", {
                          required: "يرجى إدخال رقم البطاقة",
                          pattern: { value: /^\d{16}$/, message: "أدخل 16 رقماً" },
                        })}
                        maxLength={16}
                        inputMode="numeric"
                        placeholder="•••• •••• •••• ••••"
                        className={fieldClass(Boolean(errors.cardNumber))}
                      />
                      {errors.cardNumber && (
                        <span className="mt-1 block text-xs font-normal text-[#a04a3a]">
                          {errors.cardNumber.message}
                        </span>
                      )}
                    </label>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <label className="text-sm font-extrabold text-[#302c27]">
                        تاريخ الانتهاء
                        <input
                          {...register("expiry", {
                            required: "يرجى إدخال تاريخ الانتهاء",
                            pattern: {
                              value: /^(0[1-9]|1[0-2])\/\d{2}$/,
                              message: "استخدم صيغة MM/YY",
                            },
                          })}
                          placeholder="MM/YY"
                          className={fieldClass(Boolean(errors.expiry))}
                        />
                        {errors.expiry && (
                          <span className="mt-1 block text-xs font-normal text-[#a04a3a]">
                            {errors.expiry.message}
                          </span>
                        )}
                      </label>

                      <label className="text-sm font-extrabold text-[#302c27]">
                        رمز التحقق CVV
                        <input
                          {...register("cvv", {
                            required: "يرجى إدخال رمز التحقق",
                            pattern: { value: /^\d{3,4}$/, message: "أدخل 3 أو 4 أرقام" },
                          })}
                          maxLength={4}
                          inputMode="numeric"
                          placeholder="•••"
                          className={fieldClass(Boolean(errors.cvv))}
                        />
                        {errors.cvv && (
                          <span className="mt-1 block text-xs font-normal text-[#a04a3a]">
                            {errors.cvv.message}
                          </span>
                        )}
                      </label>
                    </div>
                  </div>
                )}

                {!requiresCard && paymentMethod !== "cash" && (
                  <div className="mt-5">
                    <label className="block text-sm font-extrabold text-[#302c27]">
                      رقم الجوال المرتبط بالمحفظة
                      <input
                        {...register("walletPhone", {
                          required: "يرجى إدخال رقم الجوال",
                          pattern: {
                            value: /^(77|73|71|78|70)\d{7}$/,
                            message: "أدخل رقم جوال يمني صحيح",
                          },
                        })}
                        type="tel"
                        dir="ltr"
                        placeholder="7XXXXXXXX"
                        className={fieldClass(Boolean(errors.walletPhone))}
                      />
                      {errors.walletPhone && (
                        <span className="mt-1 block text-xs font-normal text-[#a04a3a]">
                          {errors.walletPhone.message}
                        </span>
                      )}
                    </label>
                  </div>
                )}
              </section>
            </div>

            {/* Sidebar Summary */}
            <aside className="sticky top-24 space-y-4">
              <div className="rounded-2xl border border-[#ded8cf] bg-[#eeece7] p-5 shadow-sm">
                <div className="mb-4">
                  <CartReservationTimer variant="mini" />
                </div>

                <h2 className="text-xl font-extrabold text-[#3e522c]">
                  ملخص الطلب
                </h2>

                <div className="mt-4 space-y-3 border-b border-[#d8d3ca] pb-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="relative shrink-0 overflow-hidden rounded-lg bg-[#dfd9cf] size-14">
                        <img
                          src={resolveImageUrl(item.image) || getProductImage(item.productId)}
                          alt={item.name}
                          className="size-full object-cover"
                          onError={(event) => {
                            const fallbackImage = getProductImage(item.productId);
                            if (event.currentTarget.src !== fallbackImage) {
                              event.currentTarget.src = fallbackImage;
                            }
                          }}
                        />
                        <span className="absolute bottom-0 right-0 bg-black/70 p-0.5 text-white">
                          <Lock className="size-2 text-[#a8d38d]" />
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-[#302c27]">
                          {item.name}
                        </p>
                        <p className="mt-0.5 text-xs text-[#504b44]">
                          {item.quantity}x · {formatPrice(item.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 space-y-2.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#504b44]">المجموع الفرعي</span>
                    <strong className="font-bold text-[#211f1b]">
                      {formatPrice(subtotal)}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#504b44]">تكلفة الشحن</span>
                    <strong>{shippingFee === 0 ? "مجاني" : formatPrice(shippingFee)}</strong>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-[#d8d3ca] pt-4 text-lg font-extrabold text-[#3e522c]">
                  <span>الإجمالي الكلي</span>
                  <span>{formatPrice(total)}</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#52663c] px-5 py-4 text-sm font-extrabold text-white shadow-md transition hover:bg-[#3e522c] hover:shadow-lg disabled:cursor-not-allowed disabled:bg-[#aeb6a2] active:scale-98"
                >
                  <LockKeyhole className="size-4" />
                  {isSubmitting ? "جارٍ تأكيد الطلب..." : "تأكيد الدفع وحجز الطلب"}
                </button>

                <div className="mt-4 flex items-center justify-center gap-2 border-t border-[#d8d3ca] pt-3 text-[10px] font-bold text-[#504b44]">
                  <Check className="size-4 text-[#52663c]" />
                  بياناتك مشفرة والمخزون محجوز بأمان
                </div>
              </div>
            </aside>
          </form>
        </div>
      </motion.main>
    </CatalogLayout>
  );
}
