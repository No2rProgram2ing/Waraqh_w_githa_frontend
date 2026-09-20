import { useEffect, useRef, useState } from "react";
import { Star, Trash2, Pencil, Plus } from "lucide-react";
import Swal from "sweetalert2";
import { AccountLayout } from "@/layouts/AccountLayout";
import {
  productReviewsApi,
  type ProductReview,
  type PurchasedProduct,
} from "@/api/productReviewsApi";
import { showErrorToast, showSuccessToast } from "@/lib/toast";

export function CustomerReviewsPage() {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [products, setProducts] = useState<PurchasedProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [editing, setEditing] = useState<ProductReview | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const submitInProgress = useRef(false);

  const loadData = async () => {
    try {
      const [myReviews, purchasedProducts] = await Promise.all([
        productReviewsApi.getMyReviews(),
        productReviewsApi.getPurchasedProducts(),
      ]);
      const purchasedProductNames = new Map(
        purchasedProducts.map((product) => [String(product.id), product.name]),
      );
      setReviews(
        myReviews.map((review) => {
          const productId =
            review.product_id ?? review.product?.id ?? review.product?.product_id;
          const productName =
            review.product_name ??
            review.product?.name ??
            review.product?.title ??
            (productId ? purchasedProductNames.get(String(productId)) : undefined);

          return {
            ...review,
            product_id: productId,
            product_name: productName,
          };
        }),
      );
      setProducts(purchasedProducts);
    } catch (error) {
      console.error("Failed to load customer reviews", error);
      showErrorToast("تعذر تحميل تقييماتك ومنتجاتك المشتراة.");
    } finally {
      setIsLoading(false);
      setIsProductsLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const resetForm = () => {
    setEditing(null);
    setSelectedProduct("");
    setRating(5);
    setComment("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitInProgress.current) return;

    const productId = editing?.product_id ?? editing?.product?.id ?? selectedProduct;
    if (!productId || !comment.trim()) {
      showErrorToast("اختر منتجاً واكتب تعليقاً قبل الإرسال.");
      return;
    }

    try {
      submitInProgress.current = true;
      setIsSaving(true);
      if (editing) {
        await productReviewsApi.updateReview(editing.id, productId, { rating, comment });
      } else {
        await productReviewsApi.addReview(productId, { rating, comment });
      }
      showSuccessToast("تم إرسال التقييم للمراجعة، وسيظهر بعد اعتماد الإدارة.");
      resetForm();
      await loadData();
    } catch (error) {
      console.error("Failed to save customer review", error);
      showErrorToast("تعذر إرسال التقييم، يرجى المحاولة مرة أخرى.");
    } finally {
      submitInProgress.current = false;
      setIsSaving(false);
    }
  };

  const handleDelete = async (review: ProductReview) => {
    const confirmation = await Swal.fire({
      title: "هل أنت متأكد؟",
      text: "سيتم حذف التقييم والتعليق نهائيًا ولا يمكن التراجع عن هذا الإجراء.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "نعم، احذف التقييم",
      cancelButtonText: "إلغاء",
      reverseButtons: true,
      focusCancel: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#52663c",
      customClass: {
        popup: "font-sans",
      },
    });

    if (!confirmation.isConfirmed) return;

    try {
      await productReviewsApi.deleteReview(review.id, review.product_id ?? review.product?.id ?? undefined);
      setReviews((current) => current.filter((item) => item.id !== review.id));
      await Swal.fire({
        title: "تم الحذف",
        text: "تم حذف التقييم والتعليق بنجاح.",
        icon: "success",
        confirmButtonText: "حسنًا",
        confirmButtonColor: "#52663c",
      });
    } catch (error) {
      console.error("Failed to delete customer review", error);
      await Swal.fire({
        title: "تعذر الحذف",
        text: "تعذر حذف التقييم، يرجى المحاولة مرة أخرى.",
        icon: "error",
        confirmButtonText: "حسنًا",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  return (
    <AccountLayout>
      <section dir="rtl" className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1d2218]">تقييماتي وتعليقاتي</h1>
          <p className="mt-2 text-sm text-[#687060]">
            يمكنك تقييم المنتجات التي اشتريتها، وتعديل تقييماتك قبل إعادة إرسالها للمراجعة.
          </p>
        </div>

        {!editing && (
        <form onSubmit={handleSubmit} className="rounded-2xl border border-[#e3ddd3] bg-white p-5 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 font-bold text-[#3e522c]">
            {editing ? <Pencil className="size-4" /> : <Plus className="size-4" />}
            {editing ? "تعديل التقييم" : "إضافة تقييم لمنتج اشتريته"}
          </h2>
          {!editing && (
            <select
              value={selectedProduct}
              onChange={(event) => setSelectedProduct(event.target.value)}
              required
              className="mb-4 h-12 w-full rounded-xl border border-[#b9a88e] bg-[#f8f5ef] px-3 text-sm outline-none focus:border-[#52663c]"
            >
              <option value="">اختر المنتج</option>
              {!isProductsLoading && products.map((product) => (
                <option key={product.id} value={product.id}>{product.name}</option>
              ))}
            </select>
          )}
          {!isProductsLoading && products.length === 0 && (
            <p className="mb-4 text-sm text-[#a05a33]">
              لا توجد منتجات مشتراة متاحة للتقييم حتى الآن.
            </p>
          )}
          {editing && (
            <div className="mb-4 rounded-xl border border-[#d9dfcf] bg-[#f3f6ed] px-4 py-3 text-sm text-[#3e522c]">
              المنتج: <strong>{editing.product_name ?? editing.product?.name ?? editing.product?.title ?? "منتج غير معروف"}</strong>
            </div>
          )}
          <div className="mb-4 flex gap-1">
            {[1, 2, 3, 4, 5].map((value) => (
              <button key={value} type="button" onClick={() => setRating(value)} aria-label={`تقييم ${value} نجوم`}>
                <Star className={`size-6 ${value <= rating ? "fill-yellow-500 text-yellow-500" : "text-[#d6d0c4]"}`} />
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            required
            rows={4}
            placeholder="اكتب تعليقك..."
            className="w-full rounded-xl border border-[#b9a88e] bg-[#f8f5ef] p-3 text-sm outline-none focus:border-[#52663c]"
          />
          <div className="mt-4 flex gap-3">
            <button disabled={isSaving} className="rounded-xl bg-[#52663c] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60">
              {isSaving ? "جارٍ الإرسال..." : "إرسال للمراجعة"}
            </button>
            {editing && <button type="button" onClick={resetForm} className="rounded-xl border px-5 py-2.5 text-sm">إلغاء</button>}
          </div>
        </form>
        )}

        {isLoading ? <p className="text-sm text-[#687060]">جارٍ تحميل تقييماتك...</p> : reviews.length === 0 ? (
          <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-[#687060]">لا توجد تقييمات حتى الآن.</div>
        ) : reviews.map((review) => (
          <article key={review.id} className="rounded-2xl border border-[#e3ddd3] bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-bold text-[#3e522c]">{review.product_name ?? review.product?.name ?? review.product?.title ?? "منتج غير معروف"}</h3>
                <div className="mt-2 flex">{[1, 2, 3, 4, 5].map((value) => <Star key={value} className={`size-4 ${value <= review.rating ? "fill-yellow-500 text-yellow-500" : "text-[#d6d0c4]"}`} />)}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-[#fff4d8] px-3 py-1 text-xs text-[#85651c]">
                  {review.status === "published" ? "منشور" : review.status === "rejected" ? "مرفوض" : "قيد المراجعة"}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(review);
                    setRating(review.rating);
                    setComment(review.comment ?? "");
                  }}
                  className="rounded-lg bg-[#52663c] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-[#3e522c]"
                >
                  تعديل
                </button>
              </div>
            </div>
            <p className="mt-4 text-sm leading-7 text-[#5e6258]">{review.comment || "تقييم بالنجوم فقط"}</p>
            {editing?.id === review.id && (
              <form onSubmit={handleSubmit} className="mt-5 rounded-xl border border-[#c8d5b7] bg-[#f7faf3] p-4">
                <p className="mb-3 text-sm font-bold text-[#3e522c]">تعديل التقييم وإرساله للمراجعة</p>
                <div className="mb-3 flex gap-1">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRating(value)}
                      aria-label={`تقييم ${value} نجوم`}
                    >
                      <Star className={`size-5 ${value <= rating ? "fill-yellow-500 text-yellow-500" : "text-[#d6d0c4]"}`} />
                    </button>
                  ))}
                </div>
                <textarea
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  required
                  rows={3}
                  className="w-full rounded-xl border border-[#b9a88e] bg-white p-3 text-sm outline-none focus:border-[#52663c]"
                />
                <div className="mt-3 flex gap-2">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="rounded-lg bg-[#52663c] px-4 py-2 text-xs font-bold text-white disabled:opacity-60"
                  >
                    {isSaving ? "جارٍ الإرسال..." : "حفظ وإرسال للمراجعة"}
                  </button>
                  <button type="button" onClick={resetForm} className="rounded-lg border px-4 py-2 text-xs">
                    إلغاء
                  </button>
                </div>
              </form>
            )}
            <div className="mt-4 flex gap-2">
              <button type="button" onClick={() => void handleDelete(review)} className="rounded-lg border border-red-200 px-3 py-2 text-xs text-red-600"><Trash2 className="ml-1 inline size-3" />حذف</button>
            </div>
          </article>
        ))}
      </section>
    </AccountLayout>
  );
}
