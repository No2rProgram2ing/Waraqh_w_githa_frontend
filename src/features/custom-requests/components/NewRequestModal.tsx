import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import type { CreateCustomRequestInput, ProductOption } from "@/api/customRequestsApi";
import { customRequestsApi } from "@/api/customRequestsApi";

export interface NewRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: CreateCustomRequestInput) => Promise<void>;
  isLoading?: boolean;
}

export function NewRequestModal({ isOpen, onClose, onSubmit, isLoading }: NewRequestModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [woodType, setWoodType] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [budget, setBudget] = useState("");

  // New fields for product selection
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | number | undefined>(undefined);
  const [quantity, setQuantity] = useState<number | string>(1);
  const [lengthCm, setLengthCm] = useState<number | string>("");
  const [widthCm, setWidthCm] = useState<number | string>("");
  const [heightCm, setHeightCm] = useState<number | string>("");
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productsError, setProductsError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    let mounted = true;
    setLoadingProducts(true);
    setProductsError(null);

    customRequestsApi
      .getProducts()
      .then((list) => {
        if (!mounted) return;
        setProducts(list);
        if (list.length > 0) {
          setSelectedProductId(list[0].id);
        }
      })
      .catch((err) => {
        setProductsError((err as Error)?.message ?? String(err));
      })
      .finally(() => {
        setLoadingProducts(false);
      });

    return () => {
      mounted = false;
    };
  }, [isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!description.trim() && !selectedProductId) return;

    const payload: CreateCustomRequestInput = {
      title: title || undefined,
      description: description || undefined,
      woodType: woodType || undefined,
      dimensions: dimensions || undefined,
      budget: budget || undefined,
      base_product_id: selectedProductId,
      quantity: Number(quantity) || 1,
      length_cm: lengthCm === "" ? undefined : Number(lengthCm),
      width_cm: widthCm === "" ? undefined : Number(widthCm),
      height_cm: heightCm === "" ? undefined : Number(heightCm),
      customer_notes: description || title || undefined,
    };

    await onSubmit(payload);

    setTitle("");
    setDescription("");
    setWoodType("");
    setDimensions("");
    setBudget("");
    setSelectedProductId(undefined);
    setQuantity(1);
    setLengthCm("");
    setWidthCm("");
    setHeightCm("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="طلب تصميم خاص جديد" maxWidth="lg">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 py-2">
        <Input
          label="عنوان القطعة أو التصميم"
          placeholder="مثال: طاولة طعام من خشب الجوز اليمني"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Textarea
          label="الوصف والمواصفات التفصيلية *"
          placeholder="اذكر الفكرة بالتفصيل، التفاصيل الزخرفية، الاستخدام المتوقع..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="نوع الخشب / المواد الفاخرة"
            placeholder="خشب سدر / جوز / راتان..."
            value={woodType}
            onChange={(e) => setWoodType(e.target.value)}
          />

          <Input
            label="الأبعاد التقريبية (وصف)
"
            placeholder="مثال: 120 × 80 سم"
            value={dimensions}
            onChange={(e) => setDimensions(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">منتج (اختياري)</label>
            {loadingProducts ? (
              <div className="text-sm text-[var(--color-text-muted)]">جارٍ التحميل...</div>
            ) : productsError ? (
              <div className="text-sm text-red-600">فشل تحميل المنتجات: {productsError}</div>
            ) : (
              <select
                value={selectedProductId ?? ""}
                onChange={(e) => setSelectedProductId(e.target.value ? (e.target.value as unknown as string) : undefined)}
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] px-4 py-2.5 text-sm outline-none focus:border-[#45592D] transition-colors"
              >
                <option value="">لا يوجد منتج محدد</option>
                {products.map((p) => (
                  <option key={p.id} value={String(p.id)}>
                    {p.name} {p.price ? ` - ${p.price}` : ""}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <Input
              label="الكمية"
              placeholder="1"
              type="number"
              value={String(quantity)}
              onChange={(e) => setQuantity(e.target.value ? Number(e.target.value) : 1)}
            />
          </div>

          <div>
            <Input
              label="الميزانية التقديرية ($ / ر.ي)"
              placeholder="مثال: $500 - $800"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="الطول (سم)"
            placeholder="مثال: 120"
            value={String(lengthCm)}
            onChange={(e) => setLengthCm(e.target.value)}
          />
          <Input
            label="العرض (سم)"
            placeholder="مثال: 80"
            value={String(widthCm)}
            onChange={(e) => setWidthCm(e.target.value)}
          />
          <Input
            label="الارتفاع (سم)"
            placeholder="مثال: 40"
            value={String(heightCm)}
            onChange={(e) => setHeightCm(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-brand-border/60">
          <Button type="button" variant="ghost" onClick={onClose}>
            إلغاء
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            إرسال طلب التصميم
          </Button>
        </div>
      </form>
    </Modal>
  );
}
