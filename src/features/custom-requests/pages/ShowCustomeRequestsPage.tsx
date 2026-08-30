import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/Button";
import { PlusIcon } from "@/components/ui/icons";
import { RequestCard } from "@/features/custom-requests/components/RequestCard";
import { useCustomRequests } from "@/features/custom-requests/hooks/useCustomRequests";
import { AccountLayout } from "@/layouts/AccountLayout";
import { ROUTES } from "@/routes/paths";
import type { CreateCustomRequestInput } from "@/api/customRequestsApi";

export function ShowCustomRequestsPage() {
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const navigate = useNavigate();
  const { requests, isLoading, isError, error, createRequest, isCreating } = useCustomRequests();

  const handleCreateRequest = async (input: CreateCustomRequestInput) => {
    const createdRequest = await createRequest(input);
    navigate(ROUTES.customRequestDetails(createdRequest.id));
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
            onClick={() => navigate(ROUTES.customRequestsNew)}
            className="h-12 rounded-xl bg-[#4f5f3d] px-5 text-[15px] font-bold text-white shadow-[0_12px_18px_-12px_rgba(79,95,61,0.8)] hover:bg-[#465734]"
          >
            <span>طلب جديد</span>
            <PlusIcon className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {isError ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              فشل تحميل طلبات التصميم. {error instanceof Error ? error.message : "يرجى المحاولة لاحقاً."}
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center rounded-2xl border border-[#e7e1d7] bg-[#f8f5f2] p-8">
              <div className="flex items-center gap-3 text-[#4f5f3d]">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#cad4bd] border-t-[#4f5f3d]" />
                <span className="text-sm font-medium">جارٍ تحميل طلبات التصميم...</span>
              </div>
            </div>
          ) : requests.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#d9d0c6] bg-[#faf8f5] p-8 text-center text-[#666a61]">
              لا توجد طلبات حتى الآن.
            </div>
          ) : (
            <div className="grid gap-5 xl:grid-cols-2">
              {requests.map((req) => (
                <RequestCard
                  key={req.id}
                  request={req}
                  onSelect={() => navigate(ROUTES.customRequestDetails(String(req.id)))}
                />
              ))}
            </div>
          )}
        </div>
      </motion.section>

    </AccountLayout>
  );
}
