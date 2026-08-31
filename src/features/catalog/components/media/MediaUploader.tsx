import { useState, useRef, useEffect, useCallback } from 'react'
import { UploadCloud, X, Loader2, Image as ImageIcon } from 'lucide-react'
import { showErrorToast, showSuccessToast } from '@/lib/toast'
import { useUploadProductMedia } from '../../hooks/useUploadProductMedia'

interface MediaPreview {
  file: File
  previewUrl: string
}

interface MediaUploaderProps {
  productId: number
}

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB in bytes
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export default function MediaUploader({ productId }: MediaUploaderProps) {
  const [previews, setPreviews] = useState<MediaPreview[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { mutate: uploadMedia, isPending } = useUploadProductMedia()

  useEffect(() => {
    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p.previewUrl))
    }
  }, [previews])

  const processFiles = useCallback((selectedFiles: File[]) => {
    const validFiles: File[] = []

    selectedFiles.forEach((file) => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        showErrorToast(`الملف ${file.name} غير مدعوم. مسموح فقط بـ JPEG, PNG, WEBP.`)
        return
      }
      
      if (file.size > MAX_FILE_SIZE) {
        showErrorToast(`الملف ${file.name} يتجاوز الحد المسموح (2MB).`)
        return
      }
      
      validFiles.push(file)
    })

    if (!validFiles.length) return

    const newPreviews: MediaPreview[] = validFiles.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }))

    setPreviews((prev) => [...prev, ...newPreviews])
  }, [])

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files?.length) {
      processFiles(Array.from(e.dataTransfer.files))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return
    processFiles(Array.from(e.target.files))
    
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removePreview = (index: number) => {
    setPreviews((prev) => {
      const newPreviews = [...prev]
      URL.revokeObjectURL(newPreviews[index].previewUrl)
      newPreviews.splice(index, 1)
      return newPreviews
    })
  }

  const handleUpload = () => {
    if (!previews.length) return
    const files = previews.map((p) => p.file)

    uploadMedia(
      { productId, files },
      {
        onSuccess: () => {
          showSuccessToast('تم رفع الصور بنجاح')
          setPreviews([])
        },
        onError: () => {
          showErrorToast('حدث خطأ أثناء رفع الصور، يرجى المحاولة مرة أخرى.')
        },
      }
    )
  }

  return (
    <div className="mb-6 rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface-card)] p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-bold text-[var(--color-text-primary)]">
        رفع صور جديدة للمنتج
      </h3>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
          isDragging
            ? 'border-[var(--color-accent)] bg-[var(--color-accent-subtle)]'
            : 'border-[var(--color-border-muted)] hover:border-[var(--color-border)] hover:bg-[var(--color-surface)]'
        }`}
      >
        <div className="mb-3 rounded-full bg-[var(--color-surface-subtle)] p-4 text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)]">
          <UploadCloud size={32} strokeWidth={1.5} />
        </div>
        <p className="text-sm font-semibold text-[var(--color-text-secondary)]">
          انقر هنا لاختيار الصور أو قم بسحبها وإفلاتها
        </p>
        <p className="mt-2 text-xs font-medium text-[var(--color-text-muted)]">
          الحد الأقصى: 2MB لكل صورة (JPEG, PNG, WEBP)
        </p>
        <input
          type="file"
          multiple
          accept="image/jpeg, image/png, image/webp"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </div>

      {previews.length > 0 && (
        <div className="mt-6 animate-in fade-in slide-in-from-bottom-2">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-[var(--color-text-secondary)]">
              <ImageIcon size={18} />
              الصور المحددة ({previews.length})
            </h4>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
            {previews.map((preview, idx) => (
              <div
                key={preview.file.name + idx}
                className="group relative aspect-square overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm"
              >
                <img
                  src={preview.previewUrl}
                  alt={preview.file.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removePreview(idx); }}
                  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500/90 text-white opacity-0 backdrop-blur-sm transition-all hover:bg-red-600 group-hover:opacity-100"
                  aria-label="إزالة الصورة"
                >
                  <X size={14} strokeWidth={2.5} />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleUpload}
              disabled={isPending}
              className="flex items-center gap-2 rounded-xl bg-[#45592D] px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#5D7243] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  جاري الرفع...
                </>
              ) : (
                'تأكيد ورفع الصور'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
