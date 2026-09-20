import { useEffect, useState } from "react";
import { Star, User, Loader2 } from "lucide-react";
import { areProductReviewsEnabled, productReviewsApi } from "@/api/productReviewsApi";
import type { ProductReview } from "@/api/productReviewsApi";
import { useCustomerAuthStore } from "@/features/auth-customer/stores/customerAuthStore";
import { showErrorToast, showSuccessToast } from "@/lib/toast";

interface ProductReviewsProps {
  productId: string | number;
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [canReview, setCanReview] = useState(false);
  const [purchaseCheckFailed, setPurchaseCheckFailed] = useState(false);
  
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAuthenticated = useCustomerAuthStore((state) => state.isAuthenticated);
  const reviewsEnabled = areProductReviewsEnabled();

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      if (!reviewsEnabled) {
        if (mounted) {
          setReviews([]);
          setCanReview(false);
          setPurchaseCheckFailed(false);
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);
      try {
        const data = await productReviewsApi.getReviews(productId);
        if (mounted) setReviews(data);

        if (isAuthenticated) {
          const hasPurchased = await productReviewsApi.checkIfPurchased(productId);
          if (mounted) {
            setCanReview(hasPurchased);
            setPurchaseCheckFailed(false);
          }
        } else {
          if (mounted) {
            setCanReview(false);
            setPurchaseCheckFailed(false);
          }
        }
      } catch (err) {
        if (mounted && isAuthenticated) setPurchaseCheckFailed(true);
        console.error("Failed to load product reviews", err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    loadData();

    return () => {
      mounted = false;
    };
  }, [productId, isAuthenticated, reviewsEnabled]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedComment = comment.trim();
    const hasRating = rating !== null;
    const hasComment = trimmedComment.length > 0;

    if (!hasRating && !hasComment) {
      showErrorToast("يرجى اختيار تقييم أو كتابة تعليق قبل الإرسال");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload: { rating?: number; comment?: string } = {};

      if (hasRating) {
        payload.rating = rating;
      }

      if (hasComment) {
        payload.comment = trimmedComment;
      }

      const newReview = await productReviewsApi.addReview(productId, payload);
      if (newReview.status === "published") {
        showSuccessToast("تم نشر تقييمك بنجاح!");
        setReviews((prev) => [newReview, ...prev.filter((review) => review.id !== newReview.id)]);
      } else {
        showSuccessToast("تم إرسال تقييمك، وسيظهر بعد اعتماد الإدارة.");
      }
      setComment("");
      setRating(null);
    } catch (err: any) {
      showErrorToast(err?.response?.data?.message ?? "حدث خطأ أثناء إرسال التقييم");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-12 border-t border-[#e2dbd0] pt-10" dir="rtl">
      <h2 className="text-2xl font-extrabold text-[#3e522c] mb-6">آراء وتقييمات العملاء</h2>

      {isLoading ? (
        <div className="flex items-center justify-center py-10 text-[#77766d]">
          <Loader2 className="size-6 animate-spin" />
          <span className="mr-3 text-sm">جارٍ تحميل التقييمات...</span>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
          
          {/* Add Review Section */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-[#ded8cf] bg-[#fbfaf7] p-6 shadow-sm">
              <h3 className="text-lg font-bold text-[#3e522c] mb-4">أضف تقييمك</h3>
              
              {!reviewsEnabled ? (
                <div className="rounded-xl bg-[#f3efe9] p-4 text-center text-sm text-[#5e6258]">
                  ميزة التقييمات غير مفعلة حاليًا من جهة الخادم.
                </div>
              ) : !isAuthenticated ? (
                <div className="rounded-xl bg-[#f3efe9] p-4 text-center text-sm text-[#5e6258]">
                  يرجى تسجيل الدخول لتتمكن من إضافة تقييمك لهذا المنتج.
                </div>
              ) : purchaseCheckFailed ? (
                <div className="rounded-xl border border-[#efc2c2] bg-[#fff3f3] p-4 text-center text-sm text-[#8b3434]">
                  تعذر التحقق من سجل مشترياتك حاليًا. يرجى المحاولة مرة أخرى.
                </div>
              ) : !canReview ? (
                <div className="rounded-xl bg-[#fff8e8] border border-[#e6c98e] p-4 text-center text-sm text-[#76531e]">
                  لا يمكنك تقييم هذا المنتج إلا بعد إتمام عملية شرائه.
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-sm font-bold text-[#302c27] mb-2">التقييم</label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className={`transition ${rating !== null && star <= rating ? "text-yellow-500" : "text-[#d6d0c4] hover:text-yellow-400"}`}
                          aria-label={`تقييم ${star} نجوم`}
                        >
                          <Star className="size-6 fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[#302c27] mb-2">تعليقك</label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="ما رأيك في هذا المنتج؟..."
                      rows={4}
                      className="w-full resize-none rounded-xl border border-[#b9a88e] bg-white p-3 text-sm outline-none focus:border-[#3e522c]"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || (!rating && !comment.trim())}
                    className="mt-2 w-full rounded-xl bg-[#52663c] py-3 text-sm font-bold text-white transition hover:bg-[#3e522c] disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "جارٍ الإرسال..." : "إرسال التقييم"}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-2">
            {reviews.length === 0 ? (
              <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-[#d5ccbe] text-sm text-[#77766d]">
                لا توجد تقييمات لهذا المنتج حتى الآن.
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {reviews.map((review) => (
                  <div key={review.id} className="rounded-xl border border-[#e2dbd0] bg-white p-5 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3efe9] text-[#52663c]">
                          <User className="size-5" />
                        </div>
                        <div>
                          <p className="font-bold text-[#20251b]">
                            {review.customer_name ?? review.customer?.name ?? review.user?.name ?? "عميل ورقة وجذع"}
                          </p>
                          <p className="text-xs text-[#8b7652]">
                            {new Date(review.created_at).toLocaleDateString("ar-SA", { year: 'numeric', month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center text-yellow-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`size-4 ${i < review.rating ? "fill-current" : "text-[#e2dbd0]"}`} />
                        ))}
                      </div>
                    </div>
                    {review.comment && (
                      <p className="mt-4 text-sm leading-relaxed text-[#5e6258]">{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
