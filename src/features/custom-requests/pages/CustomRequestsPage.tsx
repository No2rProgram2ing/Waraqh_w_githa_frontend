import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { motion } from "framer-motion";
import {
  Archive,
  ArrowLeft,
  ArrowRight,
  Gift,
  ImagePlus,
  Palette,
  PencilLine,
  Sparkles,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import {
  customRequestsApi,
  type CreateCustomRequestInput,
  type ProductAttributeOption,
} from "@/api/customRequestsApi";
import { CatalogLayout } from "@/layouts/CatalogLayout";
import { useCustomRequests } from "@/features/custom-requests/hooks/useCustomRequests";
import { ROUTES } from "@/routes/paths";
import { profileApi } from "@/api/profileApi";
import { useCustomerAuthStore } from "@/features/auth-customer/stores/customerAuthStore";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { extractMessage } from "@/utils/apiErrors";

type Step = 1 | 2 | 3 | 4;
type DimensionKey = "length" | "width" | "height";
type Dimensions = Record<DimensionKey, string>;
const MAX_DIMENSION_CM = 100000;

function getTodayDate(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

interface ProductOption {
  id: string | number;
  name: string;
}

const requestTypes = [
  { label: "سلة تخزين", icon: Archive },
  { label: "ديكور", icon: Palette },
  { label: "إكسسوار عرس", icon: Sparkles },
  { label: "هدية تذكارية", icon: Gift },
  { label: "أخرى", icon: PencilLine },
];

const materialOptions = [
  {
    label: "نسيج تقليدي",
    image:
      "https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&w=500&q=85",
  },
  {
    label: "نمط عصري",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=500&q=85",
  },
  {
    label: "خشب دافئ",
    image:
      "https://images.unsplash.com/photo-1601058268499-e52658b8bb88?auto=format&fit=crop&w=500&q=85",
  },
  {
    label: "مزيج طبيعي",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=500&q=85",
  },
];

function normalizeAttributeOptions(options: ProductAttributeOption["options"]): string[] {
  if (Array.isArray(options)) {
    return options.map((option) => option.trim()).filter(Boolean);
  }

  if (typeof options !== "string") {
    return [];
  }

  const trimmedOptions = options.trim();
  if (trimmedOptions.startsWith("[") && trimmedOptions.endsWith("]")) {
    try {
      const parsedOptions: unknown = JSON.parse(trimmedOptions);
      if (Array.isArray(parsedOptions)) {
        return parsedOptions
          .filter((option): option is string => typeof option === "string")
          .map((option) => option.trim())
          .filter(Boolean);
      }
    } catch {
      // Fall back to comma-separated options when the value is not valid JSON.
    }
  }

  return trimmedOptions
    .split(",")
    .map((option) => option.replace(/^["']|["']$/g, "").trim())
    .filter(Boolean);
}

function Stepper({ currentStep }: { currentStep: Step }) {
  const labels = [
    "نوع الطلب",
    "التفاصيل الفنية",
    "الميزانية والموعد",
    "بيانات التواصل",
  ];

  return (
    <div className="mb-10 flex items-start">
      {labels.map((label, index) => {
        const step = (index + 1) as Step;
        const active = step === currentStep;
        const complete = step < currentStep;

        return (
          <div key={label} className="flex flex-1 items-start">
            <div className="flex min-w-0 flex-1 flex-col items-center gap-2">
              <span
                className={`flex size-8 items-center justify-center rounded-full border-2 text-xs font-extrabold ${
                  active
                    ? "border-[#9b6a3d] bg-white text-[#795238]"
                    : complete
                      ? "border-[#52663c] bg-[#52663c] text-white"
                      : "border-[#dedbd5] bg-[#dedbd5] text-[#3f3d38]"
                }`}
              >
                {complete ? "✓" : step}
              </span>

              <span
                className={`text-center text-[10px] font-bold ${
                  active ? "text-[#795238]" : "text-[#3f3d38]"
                }`}
              >
                {label}
              </span>
            </div>

            {step < 4 && (
              <span className="mt-4 h-px flex-1 bg-[#c9c4bb]" />
            )}
          </div>
        );
      })}
    </div>
  );
}

function TypeStep({
  selectedType,
  setSelectedType,
  otherType,
  setOtherType,
  products,
  selectedProductId,
  setSelectedProductId,
  quantity,
  setQuantity,
  attributeValues,
  setAttributeValues,
  description,
  setDescription,
  onNext,
}: {
  selectedType: string;
  setSelectedType: (value: string) => void;
  otherType: string;
  setOtherType: (value: string) => void;
  products: ProductOption[];
  selectedProductId: string;
  setSelectedProductId: (value: string) => void;
  quantity: string;
  setQuantity: (value: string) => void;
  attributeValues: Record<number, string>;
  setAttributeValues: (value: Record<number, string>) => void;
  description: string;
  setDescription: (value: string) => void;
  onNext: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const selectedProduct = products.find((product) => String(product.id) === selectedProductId);
  const attributes = selectedProduct?.attributes ?? [];
  const today = getTodayDate();

  return (
    <form onSubmit={onNext}>
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-[#211f1b] sm:text-4xl">
          طلب تصميم خاص
        </h1>

        <p className="mt-3 text-sm leading-7 text-[#504b44]">
          دعنا نصنع لك قطعة فنية فريدة تعكس ذوقك وتضيف لمسة جميلة إلى منزلك.
        </p>
      </div>

      <h2 className="mb-5 mt-8 text-lg font-extrabold text-[#3e522c]">
        ما نوع القطعة التي ترغب بتصميمها؟
      </h2>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {requestTypes.map(({ label, icon: Icon }) => (
          <button
            key={label}
            type="button"
            onClick={() => {
              setSelectedType(label);
              if (label !== "أخرى") {
                setOtherType("");
              }
            }}
            className={`flex min-h-20 flex-col items-center justify-center gap-2 rounded-[5px] border text-xs font-bold transition ${
              selectedType === label
                ? "border-[#3e522c] bg-[#e5eddc] text-[#26351e] shadow-sm"
                : "border-[#c8c0b4] bg-[#fbf9f5] text-[#3a3028] hover:border-[#8e704f] hover:bg-[#f6f0e7]"
            }`}
          >
            <Icon className="size-5" />
            {label}
          </button>
        ))}
      </div>

      {selectedType === "أخرى" && (
        <div className="mt-6">
          <label
            htmlFor="other-request-type"
            className="mb-3 block text-lg font-extrabold text-[#3e522c]"
          >
            ما نوع القطعة التي ترغب بتصميمها؟
          </label>
          <input
            id="other-request-type"
            type="text"
            value={otherType}
            onChange={(event) => setOtherType(event.target.value)}
            placeholder="اكتب نوع القطعة التي ترغب بتصميمها"
            required
            className="w-full rounded-[7px] border border-[#b9a88e] bg-[#f8f5ef] px-4 py-3 text-sm text-[#211f1b] outline-none placeholder:text-[#615b53] focus:border-[#3e522c] focus:bg-white"
          />
        </div>
      )}

      <div className="mt-7 border-t border-[#ded8cf] pt-6">
        <label htmlFor="base-product" className="mb-3 block text-lg font-extrabold text-[#3e522c]">
          المنتج الأساسي للتخصيص
        </label>
        <select
          id="base-product"
          value={selectedProductId}
          onChange={(event) => setSelectedProductId(event.target.value)}
          required
          className="mb-6 h-[60px] w-full rounded-[12px] border border-[#2b2724] bg-[#1d1a18] px-4 py-3 text-right text-[15px] font-medium text-white outline-none transition focus:border-[#7d8d64] focus:ring-2 focus:ring-[#b5bf9e]"
        >
          <option value="" className="bg-white text-[#211f1b]">اختر منتجًا</option>
          {products.map((product) => (
            <option key={product.id} value={String(product.id)} className="bg-white text-[#211f1b]">
              {product.name}
            </option>
          ))}
        </select>

        {attributes.length > 0 && (
          <div className="mb-6 space-y-4">
            {attributes.map((attribute: ProductAttributeOption) => {
              const fieldClassName =
                "mt-2 h-[60px] w-full rounded-[12px] border border-[#2b2724] bg-[#1d1a18] px-4 py-3 text-right text-[15px] font-medium text-white outline-none transition placeholder:text-[#cdc7be] focus:border-[#7d8d64] focus:ring-2 focus:ring-[#b5bf9e]";

              return (
                <label
                  key={attribute.id}
                  className="block text-[15px] font-extrabold text-[#3e522c]"
                >
                  <span className="mb-2 block">{attribute.display_name}</span>
                  {attribute.is_required && <span className="text-red-600"> *</span>}
                  {attribute.input_type === "select" &&
                  normalizeAttributeOptions(attribute.options).length > 0 ? (
                    <select
                      value={attributeValues[attribute.id] ?? ""}
                      onChange={(event) =>
                        setAttributeValues({
                          ...attributeValues,
                          [attribute.id]: event.target.value,
                        })
                      }
                      required={attribute.is_required}
                      className={fieldClassName}
                    >
                      <option value="" className="bg-white text-[#211f1b]">اختر قيمة</option>
                      {normalizeAttributeOptions(attribute.options).map((option) => (
                        <option key={option} value={option} className="bg-white text-[#211f1b]">
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={attribute.input_type === "number" ? "number" : "text"}
                      value={attributeValues[attribute.id] ?? ""}
                      onChange={(event) =>
                        setAttributeValues({
                          ...attributeValues,
                          [attribute.id]: event.target.value,
                        })
                      }
                      required={attribute.is_required}
                      placeholder="اختر قيمة"
                      className={fieldClassName}
                    />
                  )}
                </label>
              );
            })}
          </div>
        )}

        <label
          htmlFor="request-quantity"
          className="mb-6 block text-[15px] font-extrabold text-[#3e522c]"
        >
          <span className="mb-2 block">الكمية</span>
          <input
            id="request-quantity"
            type="number"
            min="1"
            step="1"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            required
            className="h-[60px] w-full rounded-[12px] border border-[#2b2724] bg-[#1d1a18] px-4 py-3 text-right text-[15px] font-medium text-white outline-none transition focus:border-[#7d8d64] focus:ring-2 focus:ring-[#b5bf9e]"
          />
        </label>

        <label
          htmlFor="request-description"
          className="mb-3 block text-lg font-extrabold text-[#3e522c]"
        >
          صف تفاصيل الفكرة
        </label>

        <textarea
          id="request-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="اكتب هنا تفاصيل التصميم، الألوان المقترحة، أو أي ملاحظات خاصة تود إضافتها للقطعة..."
          rows={5}
          className="w-full resize-none rounded-[7px] border border-[#b9a88e] bg-[#f8f5ef] p-4 text-sm leading-7 text-[#211f1b] outline-none placeholder:text-[#615b53] focus:border-[#3e522c] focus:bg-white"
        />
      </div>

      <div className="mt-8 flex items-center justify-between gap-4">
        <Link
          to={ROUTES.home}
          className="text-sm font-bold text-[#403c36] hover:text-[#3e522c]"
        >
          إلغاء
        </Link>

        <button
          type="submit"
          disabled={
            !selectedType ||
            (selectedType === "أخرى" && !otherType.trim()) ||
            !selectedProductId ||
            !quantity ||
            Number(quantity) < 1 ||
            !description.trim()
          }
          className="inline-flex min-w-40 items-center justify-center gap-2 rounded-sm bg-[#52663c] px-6 py-3 text-sm font-extrabold text-white transition hover:bg-[#3e522c] disabled:cursor-not-allowed disabled:bg-[#aeb6a2]"
        >
          التالي
          <ArrowLeft className="size-4" />
        </button>
      </div>
    </form>
  );
}

function DetailsStep({
  dimensions,
  setDimensions,
  selectedMaterial,
  setSelectedMaterial,
  setSelectedMaterialImage,
  files,
  setFiles,
  onBack,
  onNext,
}: {
  dimensions: Dimensions;
  setDimensions: (value: Dimensions) => void;
  selectedMaterial: string;
  setSelectedMaterial: (value: string) => void;
  setSelectedMaterialImage: (value: string) => void;
  files: File[];
  setFiles: (value: File[]) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const [dimensionErrors, setDimensionErrors] = useState<Record<DimensionKey, boolean>>({
    length: false,
    width: false,
    height: false,
  });

  return (
    <div>
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-[#211f1b] sm:text-4xl">
          التفاصيل الفنية والقياسات
        </h1>

        <p className="mt-3 text-sm leading-7 text-[#504b44]">
          ساعدنا في فهم فكرتك بشكل أدق من خلال تحديد المقاسات والخامات المفضلة.
        </p>
      </div>

      <div className="mt-8 border-r-2 border-[#c79645] pr-4">
        <h2 className="text-lg font-extrabold text-[#3e522c]">
          الأبعاد المطلوبة (اختياري)
        </h2>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {(["length", "width", "height"] as DimensionKey[]).map((field) => (
            <label
              key={field}
              className="text-sm font-bold text-[#302c27]"
            >
              {field === "length"
                ? "الطول (سم)"
                : field === "width"
                  ? "العرض (سم)"
                  : "الارتفاع (سم)"}

              <div className="mt-2 flex items-center rounded-[7px] border border-[#b9a88e] bg-[#f8f5ef] px-3">
                <input
                  value={dimensions[field]}
                  onChange={(event) => {
                    const value = event.target.value;

                    if (value === "") {
                      setDimensionErrors({ ...dimensionErrors, [field]: false });
                      setDimensions({ ...dimensions, [field]: "" });
                      return;
                    }

                    const numericValue = Number(value);
                    if (!Number.isFinite(numericValue) || numericValue < 0) {
                      return;
                    }

                    if (numericValue > MAX_DIMENSION_CM) {
                      setDimensionErrors({ ...dimensionErrors, [field]: true });
                      return;
                    }

                    setDimensionErrors({ ...dimensionErrors, [field]: false });
                    setDimensions({ ...dimensions, [field]: value });
                  }}
                  type="number"
                  min="0"
                  max={MAX_DIMENSION_CM}
                  placeholder="00"
                  className="w-full bg-transparent py-3 text-sm text-[#211f1b] outline-none placeholder:text-[#615b53]"
                />

                <span className="text-xs text-[#403c36]">سم</span>
              </div>
              {dimensionErrors[field] && (
                <p className="mt-2 text-xs font-medium text-red-600">
                  لا يمكن أن تكون القيمة أكبر من {MAX_DIMENSION_CM}.
                </p>
              )}
            </label>
          ))}
        </div>
      </div>

      <div className="mt-8 border-r-2 border-[#c79645] pr-4">
        <h2 className="text-lg font-extrabold text-[#3e522c]">
          نوع النسيج واللون المفضل
        </h2>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {materialOptions.map((option) => (
            <button
              key={option.label}
              type="button"
              onClick={() => {
                setSelectedMaterial(option.label);
                setSelectedMaterialImage(option.image);
              }}
              className={`overflow-hidden rounded-[5px] border text-xs font-bold transition ${
                selectedMaterial === option.label
                  ? "border-[#3e522c] bg-[#e5eddc] text-[#26351e]"
                  : "border-[#c8c0b4] bg-[#fbf9f5] text-[#3a3028] hover:border-[#8e704f]"
              }`}
            >
              <img
                src={option.image}
                alt={option.label}
                className="h-16 w-full object-cover"
              />

              <span className="block px-2 py-2">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 border-r-2 border-[#c79645] pr-4">
        <h2 className="text-lg font-extrabold text-[#3e522c]">
          منطقة رفع الصور المرجعية
        </h2>

        <label
          htmlFor="reference-images"
          className="mt-4 flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-[8px] border border-dashed border-[#b9a88e] bg-[#fbf9f5] p-4 text-center transition hover:bg-[#f6f0e7]"
        >
          <ImagePlus className="size-7 text-[#3e522c]" />

          <p className="mt-3 text-sm font-bold text-[#302c27]">
            اسحب الصور هنا أو انقر للاختيار
          </p>

          <p className="mt-1 text-[10px] text-[#504b44]">
            PNG, JPG بحد أقصى 5 ميجابايت
          </p>

          <input
            id="reference-images"
            type="file"
            accept="image/png,image/jpeg"
            multiple
            className="sr-only"
            onChange={(event) =>
              setFiles(Array.from(event.target.files ?? []))
            }
          />
        </label>

        {files.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-3">
            {files.map((file) => (
              <Preview
                key={`${file.name}-${file.lastModified}`}
                file={file}
              />
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-sm border border-[#9b7655] px-5 py-3 text-sm font-bold text-[#603e27] hover:bg-[#f8f1e8]"
        >
          <ArrowRight className="size-4" />
          العودة السابقة
        </button>

        <button
          type="button"
          onClick={() => {
            const hasInvalidDimension = Object.values(dimensions).some(
              (value) => value !== "" && (
                !Number.isFinite(Number(value)) ||
                Number(value) < 0 ||
                Number(value) > MAX_DIMENSION_CM
              ),
            ) || Object.values(dimensionErrors).some(Boolean);

            if (hasInvalidDimension) {
              showErrorToast(`لا يمكن أن تتجاوز الأبعاد ${MAX_DIMENSION_CM} سم.`);
              return;
            }

            onNext();
          }}
          className="inline-flex items-center gap-2 rounded-sm bg-[#52663c] px-6 py-3 text-sm font-extrabold text-white transition hover:bg-[#3e522c]"
        >
          الخطوة التالية
          <ArrowLeft className="size-4" />
        </button>
      </div>
    </div>
  );
}

function Preview({ file }: { file: File }) {
  const [source, setSource] = useState("");

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setSource(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  return source ? (
    <img
      src={source}
      alt={file.name}
      className="aspect-square w-full rounded border border-[#b9a88e] object-cover"
    />
  ) : null;
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () => reject(reader.error ?? new Error("تعذر قراءة الصورة"));
    reader.readAsDataURL(file);
  });
}

function BudgetStep({
  deliveryDate,
  setDeliveryDate,
  onBack,
  onNext,
}: {
  deliveryDate: string;
  setDeliveryDate: (value: string) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const today = getTodayDate();

  return (
    <div>
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-[#211f1b] sm:text-4xl">
          الجدول الزمني
        </h1>

        <p className="mt-3 text-sm leading-7 text-[#504b44]">
          حدد التاريخ المفضل للتسليم لنتمكن من توفير أفضل جودة.
        </p>
      </div>

      <div className="mt-8 border-r-2 border-[#c79645] pr-4">
        <label
          htmlFor="delivery-date"
          className="block text-lg font-extrabold text-[#3e522c]"
        >
          تاريخ التسليم المطلوب
        </label>

        <input
          id="delivery-date"
          type="date"
          value={deliveryDate}
          min={today}
          onChange={(event) => {
            const value = event.target.value;

            if (value && value < today) {
              showErrorToast("لا يمكن اختيار تاريخ سابق لتاريخ اليوم.");
              return;
            }

            setDeliveryDate(value);
          }}
          className="mt-4 w-full rounded-[7px] border border-[#b9a88e] bg-[#f8f5ef] px-4 py-3 text-sm text-[#211f1b] outline-none focus:border-[#3e522c]"
        />
      </div>

      <div className="mt-8 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-sm border border-[#9b7655] px-5 py-3 text-sm font-bold text-[#603e27]"
        >
          <ArrowRight className="size-4" />
          العودة السابقة
        </button>

        <button
          type="button"
          onClick={() => {
            if (!deliveryDate || deliveryDate < today) {
              showErrorToast("يرجى اختيار تاريخ اليوم أو تاريخًا لاحقًا.");
              return;
            }

            onNext();
          }}
          disabled={!deliveryDate || deliveryDate < today}
          className="inline-flex items-center gap-2 rounded-sm bg-[#52663c] px-6 py-3 text-sm font-extrabold text-white disabled:bg-[#aeb6a2]"
        >
          الخطوة التالية
          <ArrowLeft className="size-4" />
        </button>
      </div>
    </div>
  );
}

function ContactStep({
  name,
  setName,
  email,
  setEmail,
  phone,
  setPhone,
  onBack,
  onSubmit,
  isCreating,
}: {
  name: string;
  setName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  onBack: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isCreating: boolean;
}) {
  return (
    <form onSubmit={onSubmit}>
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-[#211f1b] sm:text-4xl">
          بيانات التواصل والمراجعة
        </h1>

        <p className="mt-3 text-sm leading-7 text-[#504b44]">
          أدخل بياناتك حتى نتمكن من مراجعة طلبك والتواصل معك.
        </p>
      </div>

      <div className="mt-8 space-y-5 border-t border-[#ded8cf] pt-6">
        {[
          [
            "contact-name",
            "الاسم الكامل",
            name,
            setName,
            "أحمد العبدالله",
          ],
          [
            "contact-email",
            "البريد الإلكتروني",
            email,
            setEmail,
            "ahmed@example.com",
          ],
          [
            "contact-phone",
            "رقم الهاتف",
            phone,
            setPhone,
            "+967 7XX XXX XXX",
          ],
        ].map(([id, label, value, setter, placeholder]) => (
          <label
            key={id as string}
            htmlFor={id as string}
            className="block text-sm font-extrabold text-[#302c27]"
          >
            {label as string}

            <input
              id={id as string}
              value={value as string}
              onChange={(event) =>
                (setter as (value: string) => void)(event.target.value)
              }
              placeholder={placeholder as string}
              className="mt-2 w-full rounded-[7px] border border-[#b9a88e] bg-[#f8f5ef] px-4 py-3 text-sm text-[#211f1b] outline-none placeholder:text-[#615b53] focus:border-[#3e522c]"
              required
            />
          </label>
        ))}

        <label className="flex items-center gap-2 text-xs font-semibold text-[#403c36]">
          <input
            type="checkbox"
            required
            className="size-4 accent-[#52663c]"
          />
          أوافق على سياسة الخصوصية واستخدام بياناتي للتواصل.
        </label>
      </div>

      <div className="mt-8 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-sm border border-[#9b7655] px-5 py-3 text-sm font-bold text-[#603e27]"
        >
          <ArrowRight className="size-4" />
          العودة السابقة
        </button>

        <button
          type="submit"
          disabled={isCreating}
          className="rounded-sm bg-[#18b957] px-6 py-3 text-sm font-extrabold text-white disabled:opacity-60"
        >
          {isCreating ? "جارٍ الإرسال..." : "تأكيد وإرسال عبر واتساب"}
        </button>
      </div>
    </form>
  );
}

export function CustomRequestsPage() {
  const [step, setStep] = useState<Step>(1);
  const [selectedType, setSelectedType] = useState("");
  const [otherType, setOtherType] = useState("");
  const [description, setDescription] = useState("");
  const [dimensions, setDimensions] = useState<Dimensions>({
    length: "",
    width: "",
    height: "",
  });
  const [material, setMaterial] = useState("");
  const [materialImage, setMaterialImage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [attributeValues, setAttributeValues] = useState<Record<number, string>>({});

  const { createRequest, isCreating } = useCustomRequests();
  const navigate = useNavigate();

  useEffect(() => {
    void customRequestsApi.getProducts().then((items) => setProducts(items));
    void profileApi.getProfile().then((profile) => {
      setName(profile.fullName);
      setEmail(profile.email);
      setPhone(profile.phone);
    }).catch((error) => {
      console.error("Failed to load customer profile", error);
      const user = useCustomerAuthStore.getState().user;
      setName(user?.fullName ?? "");
      setEmail(user?.email ?? "");
      setPhone(user?.phone ?? "");
    });
  }, []);

  useEffect(() => {
    if (!selectedProductId) {
      setAttributeValues({});
      return;
    }

    const currentProduct = products.find((product) => String(product.id) === selectedProductId);
    const allowedAttributeIds = new Set((currentProduct?.attributes ?? []).map((attribute) => attribute.id));

    setAttributeValues((previous) => {
      const nextValues: Record<number, string> = {};

      Object.entries(previous).forEach(([attributeId, value]) => {
        const numericId = Number(attributeId);
        if (allowedAttributeIds.has(numericId)) {
          nextValues[numericId] = value;
        }
      });

      return nextValues;
    });
  }, [products, selectedProductId]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!deliveryDate || deliveryDate < getTodayDate()) {
      showErrorToast("يرجى اختيار تاريخ اليوم أو تاريخًا لاحقًا.");
      setStep(3);
      return;
    }

    if (!quantity || !Number.isInteger(Number(quantity)) || Number(quantity) < 1) {
      showErrorToast("يرجى إدخال كمية صحيحة تبدأ من 1.");
      setStep(1);
      return;
    }

    let uploadedImage = "";
    try {
      uploadedImage = files[0] ? await readFileAsDataUrl(files[0]) : "";
    } catch (error) {
      console.error("Failed to read reference image", error);
    }

    const requestType = selectedType === "أخرى" ? otherType.trim() : selectedType;
    const notes = `${requestType}
${description}
الكمية: ${quantity}
الخامة: ${material || "غير محددة"}
التسليم: ${deliveryDate}
التواصل: ${name}، ${email}، ${phone}
الصور: ${files.map((file) => file.name).join(", ") || "لا توجد"}`;

    const input: CreateCustomRequestInput = {
      title: requestType,
      base_product_id: selectedProductId,
      attribute_values: Object.entries(attributeValues)
        .filter(([, value]) => value.trim() !== "")
        .map(([attributeId, value]) => ({
          attribute_id: Number(attributeId),
          value: value.trim(),
        })),
      quantity: Number(quantity),
      length_cm: dimensions.length || undefined,
      width_cm: dimensions.width || undefined,
      height_cm: dimensions.height || undefined,
      customer_notes: notes,
    };

    try {
      const createdRequest = await createRequest(input);

      const referenceImage = materialImage || uploadedImage;
      localStorage.setItem(`custom-request-review-${createdRequest.id}`, JSON.stringify({
        ...createdRequest,
        description: notes,
        referenceImageUrl: referenceImage || undefined,
        customer: { name, email, phone },
      }));

      if (referenceImage) {
        localStorage.setItem(`custom-request-reference-image-${createdRequest.id}`, referenceImage);
      }

      navigate(ROUTES.customRequestDetails(createdRequest.id));
    } catch (error) {
      console.error("Failed to submit custom request", error);
      showErrorToast(extractMessage(error, "تعذر إرسال الطلب، يرجى التحقق من البيانات والمحاولة مرة أخرى."));
    }
  };

  return (
    <CatalogLayout>
      <motion.main
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        dir="rtl"
        className="bg-[#f2f0ec] px-5 py-12 text-[#211f1b] sm:py-16"
      >
        <div className="mx-auto max-w-6xl">
          <Stepper currentStep={step} />

          <section className="mx-auto max-w-4xl rounded-[10px] border border-[#ded9d0] bg-white px-6 py-10 shadow-[0_14px_30px_-24px_rgba(48,42,35,0.5)] sm:px-10 sm:py-12">
            {step === 1 && (
              <TypeStep
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                otherType={otherType}
                setOtherType={setOtherType}
                products={products}
                selectedProductId={selectedProductId}
                setSelectedProductId={setSelectedProductId}
                quantity={quantity}
                setQuantity={setQuantity}
                attributeValues={attributeValues}
                setAttributeValues={setAttributeValues}
                description={description}
                setDescription={setDescription}
                onNext={(event) => {
                  event.preventDefault();
                  setStep(2);
                }}
              />
            )}

            {step === 2 && (
              <DetailsStep
                dimensions={dimensions}
                setDimensions={setDimensions}
                selectedMaterial={material}
                setSelectedMaterial={setMaterial}
                setSelectedMaterialImage={setMaterialImage}
                files={files}
                setFiles={setFiles}
                onBack={() => setStep(1)}
                onNext={() => setStep(3)}
              />
            )}

            {step === 3 && (
              <BudgetStep
                deliveryDate={deliveryDate}
                setDeliveryDate={setDeliveryDate}
                onBack={() => setStep(2)}
                onNext={() => setStep(4)}
              />
            )}

            {step === 4 && (
              <ContactStep
                name={name}
                setName={setName}
                email={email}
                setEmail={setEmail}
                phone={phone}
                setPhone={setPhone}
                onBack={() => setStep(3)}
                onSubmit={submit}
                isCreating={isCreating}
              />
            )}
          </section>
        </div>
      </motion.main>
    </CatalogLayout>
  );
}
