import { useState } from "react";
import type { FormEvent } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import type { CreateCustomRequestInput } from "@/api/customRequestsApi";

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    await onSubmit({
      title,
      description,
      woodType,
      dimensions,
      budget,
    });

    setTitle("");
    setDescription("");
    setWoodType("");
    setDimensions("");
    setBudget("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="طلب تصميم خاص جديد" maxWidth="lg">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 py-2">
        <Input
          label="عنوان القطعة أو التصميم *"
          placeholder="مثال: طاولة طعام من خشب الجوز اليمني"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
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
            label="الأبعاد التقريبية (سم)"
            placeholder="مثال: 120 × 80 سم"
            value={dimensions}
            onChange={(e) => setDimensions(e.target.value)}
          />
        </div>

        <Input
          label="الميزانية التقديرية ($ / ر.ي)"
          placeholder="مثال: $500 - $800"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />

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
