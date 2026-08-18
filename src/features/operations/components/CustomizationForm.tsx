import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { CustomizationPriceSummary } from '../components/CustomizationPriceSummary'
import { CustomizationImageUploader } from '../components/CustomizationImageUploader'
import {
  useEstimateCustomization,
  useCreateCustomization,
  useSaveDraft,
} from '../hooks/useCustomizations'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export default function CustomizationForm() {
  const [form, setForm] = useState({
    customer_name: '',
    customer_phone: '',
    address: '',
    product_id: '' as any,
    quantity: 1,
    base_price: 0,
    customization_fee: 0,
    shipping: 0,
    color: '',
    notes: '',
  })

  const [attachments, setAttachments] = useState<File[]>([])
  const [estimate, setEstimate] = useState<any | null>(null)

  const estimateMutation = useEstimateCustomization(form)
  const createMutation = useCreateCustomization()
  const saveDraftMutation = useSaveDraft(null)

  const runEstimate = async () => {
    try {
      const payload = { ...form }
      const res = await estimateMutation.mutateAsync(payload)
      setEstimate(res)
      toast.success('تم حساب السعر بنجاح')
    } catch (err) {
      console.error('Estimate error', err)
      toast.error('حدث خطأ أثناء حساب السعر')
    }
  }

  const submit = async () => {
    const fd = new FormData()

    fd.append('customer_name', form.customer_name)
    fd.append('customer_phone', form.customer_phone)
    fd.append('address', form.address)
    fd.append('product_id', String(form.product_id))
    fd.append('quantity', String(form.quantity))
    fd.append('color', form.color)
    fd.append('notes', form.notes)
    fd.append('base_price', String(form.base_price))
    fd.append('customization_fee', String(form.customization_fee))
    fd.append('shipping', String(form.shipping))

    attachments.forEach((file) => {
      fd.append('attachments[]', file)
    })

    try {
      await createMutation.mutateAsync(fd)
      toast.success('تم إنشاء طلب التخصيص')
    } catch (err) {
      console.error(err)
      toast.error('حدث خطأ أثناء إنشاء الطلب')
    }
  }

  const saveDraft = async () => {
    try {
      const payload: Record<string, any> = {
        customer_name: form.customer_name,
        customer_phone: form.customer_phone,
        address: form.address,
        product_id: form.product_id,
        quantity: form.quantity,
        base_price: form.base_price,
        customization_fee: form.customization_fee,
        shipping: form.shipping,
        color: form.color,
        notes: form.notes,
        attachments: attachments.map((file) => file.name),
      }

      await saveDraftMutation.mutateAsync(payload)
      toast.success('تم حفظ المسودة بنجاح')
    } catch (err) {
      console.error('Save draft error', err)
      toast.error('فشل حفظ المسودة')
    }
  }

  return (
    <motion.div
      dir="rtl"
      className="grid grid-cols-1 gap-6 lg:grid-cols-3"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
    >
      <div className="col-span-2">
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
            إضافة طلب تخصيص جديد
          </h2>

          <div className="mt-5 space-y-4">
            <Input
              label="اسم العميل"
              value={form.customer_name}
              onChange={(event) =>
                setForm({
                  ...form,
                  customer_name: event.target.value,
                })
              }
            />

            <Input
              label="هاتف العميل"
              value={form.customer_phone}
              onChange={(event) =>
                setForm({
                  ...form,
                  customer_phone: event.target.value,
                })
              }
            />

            <Input
              label="عنوان التوصيل"
              value={form.address}
              onChange={(event) =>
                setForm({
                  ...form,
                  address: event.target.value,
                })
              }
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                type="number"
                label="الكمية"
                value={form.quantity}
                onChange={(event) =>
                  setForm({
                    ...form,
                    quantity: Number(event.target.value),
                  })
                }
              />

              <Input
                type="number"
                label="سعر المنتج الأساسي"
                value={form.base_price}
                onChange={(event) =>
                  setForm({
                    ...form,
                    base_price: Number(event.target.value),
                  })
                }
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                type="number"
                label="رسوم التخصيص"
                value={form.customization_fee}
                onChange={(event) =>
                  setForm({
                    ...form,
                    customization_fee: Number(event.target.value),
                  })
                }
              />

              <Input
                type="number"
                label="الشحن"
                value={form.shipping}
                onChange={(event) =>
                  setForm({
                    ...form,
                    shipping: Number(event.target.value),
                  })
                }
              />
            </div>

            <div>
              <label
                htmlFor="customization-notes"
                className="mb-2 block text-sm font-medium text-[var(--color-text-primary)]"
              >
                ملاحظات إضافية
              </label>

              <textarea
                id="customization-notes"
                value={form.notes}
                onChange={(event) =>
                  setForm({
                    ...form,
                    notes: event.target.value,
                  })
                }
                rows={4}
                className="w-full resize-y rounded-[var(--radius-field)] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] px-4 py-3.5 text-[15px] text-[var(--color-text-primary)] outline-none transition-colors placeholder:text-[var(--color-text-faint)] focus:border-[var(--color-accent)] focus:bg-[var(--color-surface-card)] focus:ring-2 focus:ring-[var(--color-accent-subtle)]"
                placeholder="ملاحظات إضافية"
              />
            </div>

            <div>
              <CustomizationImageUploader
                onChange={(files) => setAttachments(files)}
              />
            </div>

            <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:flex-wrap">
              <Button
                type="button"
                onClick={runEstimate}
                isLoading={estimateMutation.isPending}
              >
                احسب السعر
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={submit}
                isLoading={createMutation.isPending}
              >
                إرسال طلب التخصيص
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={saveDraft}
                isLoading={saveDraftMutation.isPending}
              >
                حفظ كمسودة
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <aside>
        <CustomizationPriceSummary estimate={estimate} />
      </aside>
    </motion.div>
  )
}