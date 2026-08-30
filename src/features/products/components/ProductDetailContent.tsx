import { motion } from "framer-motion";
import { ArrowRightIcon, SparkleIcon } from "@/components/ui/icons";
import { Button } from "@/components/ui/Button";

const galleryImages = [
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=900&q=80",
];

const sizeOptions = ["2.5 kg", "40 cm", "45 cm", "60 cm"] as const;

const productHighlights = [
  "مادة طبيعية متينة",
  "يمتاز بمقاومة جيدة للظروف اليومية",
  "مناسب للديكور العصري والبيئات الهادئة",
] as const;

export function ProductDetailContent() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="mx-auto max-w-[1180px] px-4 py-8 sm:px-6 lg:px-8"
      dir="rtl"
    >
      <div className="mb-6 flex flex-col gap-3 border-b border-[#d9d2c6] pb-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-10 rounded-xl border-[#d3c9b8] bg-[#f6f2eb] px-4 text-sm text-[#2f312d] shadow-none hover:bg-[#efe9df]">
            <span className="inline-flex items-center gap-2">
              <span className="text-base">✎</span>
              تعديل الطلب
            </span>
          </Button>
        </div>

        <div className="inline-flex items-center justify-center gap-2 self-start rounded-full border border-[#d7d0c3] bg-[#f1efe8] px-3 py-1.5 text-[12px] font-medium text-[#4d5f3d] md:self-auto">
          <span className="h-2.5 w-2.5 rounded-full bg-[#7c8d62]" aria-hidden="true" />
          قيد المراجعة
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="text-[12px] font-medium text-[#6e766b]">رقم الطلب</span>
          <span className="rounded-full border border-[#d8d0c3] bg-[#f8f5f1] px-3 py-1 text-[12px] font-semibold text-[#2b312c]">
            #ORD: 8821
          </span>
          <button
            type="button"
            aria-label="عرض الطلب"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#d8d0c3] bg-[#f5efe8] text-[#4b4f45] transition-transform duration-200 hover:scale-105"
          >
            <ArrowRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-[#e3dcca] bg-[#f7f4ef] shadow-[0_24px_40px_-28px_rgba(52,57,46,0.35)]">
        <div className="grid gap-6 p-4 md:p-6 lg:grid-cols-[1.15fr_1.2fr] lg:gap-8 lg:p-8">
          <div className="space-y-5">
            <div className="rounded-[20px] border border-[#e0d8ca] bg-[#f2eee8] p-3">
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="overflow-hidden rounded-[18px]"
              >
                <img
                  src={galleryImages[0]}
                  alt="منتج مخطّط بدقة"
                  className="h-[320px] w-full object-cover sm:h-[420px] lg:h-[460px]"
                />
              </motion.div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {galleryImages.slice(1).map((image, index) => (
                <motion.div
                  key={image}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.12 + index * 0.08, ease: "easeOut" }}
                  whileHover={{ y: -3 }}
                  className="overflow-hidden rounded-[16px] border border-[#e2d7c7] bg-[#f1ece4]"
                >
                  <img src={image} alt="عرض المنتج" className="h-[150px] w-full object-cover" />
                </motion.div>
              ))}
            </div>
          </div>

          <div className="space-y-5 pt-1">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 rounded-full border border-[#d7d0c7] bg-[#f4efe7] px-3 py-1.5 text-[12px] font-medium text-[#4c5440]">
                <SparkleIcon className="h-3.5 w-3.5 text-[#7a8b61]" />
                منتج مميز
              </div>
              <div className="text-[12px] font-medium text-[#7a7971]">التصنيف</div>
            </div>

            <div>
              <h1 className="text-2xl font-bold text-[#1e241d] sm:text-[28px]">سلة يدويّة من الخيزران</h1>
                <p className="mt-2 text-[14px] leading-7 text-[#5d635c]">
                  سلة يدوية مصنوعة يدويًا من الخيزران الطبيعي، تتميز بتصميم أنيق يناسب الديكور الداخلي العصري
                  وتستخدم كقطعة ديكور فاخرة مع لمسة تراثية هادئة.
                </p>
            </div>

            <div className="rounded-[18px] bg-[#f3efe9] p-4 ring-1 ring-[#e3dacc]">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[13px] font-medium text-[#6b7067]">نوع الخامة</span>
                <span className="rounded-full border border-[#d7cebd] bg-[#f7f3ed] px-3 py-1 text-[12px] font-medium text-[#3d4b32]">
                  Natural Aging
                </span>
              </div>
              <ul className="mt-4 space-y-2 text-[13px] leading-6 text-[#4e564f]">
                {productHighlights.map((highlight) => (
                  <li key={highlight} className="flex items-center gap-2">
                    <span className="inline-block h-2 w-2 rounded-full bg-[#7a8b61]" aria-hidden="true" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-[16px] font-bold text-[#1d211b]">المواصفات</h2>
                <span className="text-[12px] text-[#74776d]">اختر المقاس</span>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {sizeOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={`rounded-xl border px-3 py-3 text-center text-[13px] font-medium transition-all duration-200 ${
                      option === "40 cm"
                        ? "border-[#d7c9b0] bg-[#f4efe7] text-[#2d3329] shadow-[0_12px_20px_-18px_rgba(61,79,47,0.9)]"
                        : "border-[#d7d1c8] bg-[#f8f6f2] text-[#575d57] hover:border-[#c9c0ad] hover:bg-[#f3efe9]"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[18px] border border-[#e2d9c5] bg-[#f8f5f1] p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[12px] font-medium text-[#676d64]">معدل التسليم</p>
                  <div className="mt-2 flex items-center gap-2 text-[14px] font-semibold text-[#1d211a]">
                    <span>موعد التسليم</span>
                    <span className="rounded-md border border-[#d8cdb9] bg-[#f3efe8] px-2 py-1 text-[12px] text-[#4e5548]">
                      15 يوم
                    </span>
                  </div>
                </div>

                <div className="text-left">
                  <p className="text-[12px] font-medium text-[#6a6e66]">المبلغ</p>
                  <p className="mt-1 text-[28px] font-extrabold text-[#1d2119]">$500 - $1500</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
