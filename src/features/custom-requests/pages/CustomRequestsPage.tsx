import { useState } from "react";
import { motion } from "framer-motion";
import { AccountLayout } from "@/layouts/AccountLayout";
import { Button } from "@/components/ui/Button";
import { Plus, Sparkles } from 'lucide-react';
import { ShowcaseCard } from "@/features/custom-requests/components/ShowcaseCard";
import type { ShowcaseCardData } from "@/features/custom-requests/types";
import { NewRequestModal } from "@/features/custom-requests/components/NewRequestModal";
import { useCustomRequests } from "@/features/custom-requests/hooks/useCustomRequests";
import type { CreateCustomRequestInput } from "@/api/customRequestsApi";

const cards: ShowcaseCardData[] = [
  {
    id: "panel-1",
    title: "لوحة جدارية فاخرة",
    subtitle: "تغليف عربي أنيق مع لمسات من الخشب الطبيعي وراحة عصرية في تفاصيل كل زاوية.",
    date: "٢٨ أبريل ٢٠٢٤",
    status: "مكتمل",
    accent: "8/10",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
    imageAlt: "ديكور خشبي",
  },
  {
    id: "panel-2",
    title: "طاولة وركيزة مغروسة",
    subtitle: "تصميم مخصص يجمع بين العمارة اليمنية والهوية الحديثة مع خيط دقيق في التشطيبات.",
    date: "١٦ أبريل ٢٠٢٤",
    status: "قيد التنفيذ",
    accent: "٧/١٠",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80",
    imageAlt: "طاولة خشبية",
  },
];

export function CustomRequestsPage() {
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const { createRequest, isCreating } = useCustomRequests();

  const handleCreateRequest = async (input: CreateCustomRequestInput) => {
    await createRequest(input);
  };

  return (
    <AccountLayout>
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="flex flex-col gap-6"
        dir="rtl"
      >
        <div className="flex items-center justify-between gap-3 pt-1">
          <h1 className="text-[27px] font-extrabold text-[#1d2218]">طلبات التصميم الخاص</h1>

          <Button
            type="button"
            variant="primary"
            onClick={() => setIsRequestModalOpen(true)}
            className="h-12 rounded-xl bg-[#4f5f3d] px-5 text-[15px] font-bold text-white shadow-[0_12px_18px_-12px_rgba(79,95,61,0.8)] hover:bg-[#465734]"
          >
            <span>طلب جديد</span>
            <Plus className="h-4 w-4" aria-hidden="true"/>
          </Button>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          {cards.map((card, index) => (
            <ShowcaseCard key={card.id} card={card} index={index} />
          ))}
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, delay: 0.12 }}
            className="flex min-h-57.5 flex-col items-center justify-center gap-5 rounded-3xl border border-[#d7d1c8] bg-[#4f5f3d] p-6 text-center text-white shadow-[0_16px_28px_-18px_rgba(44,57,35,0.4)]"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/40 bg-white/10">
              <Sparkles className="h-7 w-7 text-[#f7e3b7]" />
            </div>

            <div className="space-y-2">
              <p className="text-[18px] font-bold">هل لديك فكرة فريدة؟</p>
              <p className="max-w-xs text-[13px] leading-7 text-[#edf4e4]">
                نساعدك في تحويل أفكارك إلى قطعة فنية متكاملة تناسب أسلوب منزلك وتراثك المميز.
              </p>
            </div>

            <Button
              type="button"
              variant="primary"
              onClick={() => setIsRequestModalOpen(true)}
              className="h-11 rounded-xl bg-[#e6c78f] px-6 font-bold text-[#2d331f] shadow-[0_12px_18px_-12px_rgba(0,0,0,0.2)] hover:bg-[#d8b878]"
            >
              <span>استئناف الطلب</span>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.18 }}
            className="flex min-h-57.5 flex-col justify-between overflow-hidden rounded-3xl border border-[#e4dfd8] bg-[#f5f1ea] p-5 shadow-[0_8px_24px_-16px_rgba(38,47,26,0.2)]"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d4cabd] bg-white text-[#4f5f3d]">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-[11px] font-medium text-[#7c7b74]">سبت ١٢ يوليو</span>
            </div>

            <div className="space-y-2">
              <p className="text-[15px] font-bold text-[#1f231d]">مواصفات مشروعك</p>
              <p className="text-[13px] leading-7 text-[#5d5f59]">
                نقدم لك متابعة دقيقة لكل مرحلة من الخطة، من اختيار الخامة إلى التنفيذ النهائي لضمان النتيجة المتوقعة.
              </p>
            </div>

            <div className="rounded-[18px] border border-dashed border-[#cabfa8] bg-[#f0e8dc] p-3">
              <div className="h-24 rounded-[14px] bg-[linear-gradient(135deg,#d4c4a5_0%,#f2eadf_50%,#d7c8ae_100%)]" />
            </div>
          </motion.div>
        </div>
      </motion.section>

      <NewRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onSubmit={handleCreateRequest}
        isLoading={isCreating}
      />
    </AccountLayout>
  );
}
