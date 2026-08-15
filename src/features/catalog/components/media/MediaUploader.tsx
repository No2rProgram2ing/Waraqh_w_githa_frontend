import { useState, useRef } from 'react'
import type { MediaPreview } from '../../types/product-media'
import { showErrorToast, showSuccessToast, showValidationErrorToast } from '@/lib/toast'
import { useUploadProductMedia } from '../../hooks/useProductMedia'

interface MediaUploaderProps {
    productId: number
}

export default function MediaUploader({ productId }: MediaUploaderProps) {
    const [previews, setPreviews] = useState<MediaPreview[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)
    
    const { mutate: uploadMedia, isPending } = useUploadProductMedia()

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return

        const files = Array.from(e.target.files)
        const newPreviews: MediaPreview[] = files.map((file) => ({
            file,
            previewUrl: URL.createObjectURL(file),
            type: file.type.startsWith('video/') ? 'video' : 'image',
        }))

        setPreviews((prev) => [...prev, ...newPreviews])
        
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
                    showSuccessToast('تم رفع الوسائط بنجاح')
                    previews.forEach((p) => URL.revokeObjectURL(p.previewUrl))
                    setPreviews([])
                },
                onError: (error: any) => {
                    const validationErrors = error?.response?.data?.errors as Record<string, string[]> | undefined
                    if (validationErrors) {
                        showValidationErrorToast(validationErrors)
                        return
                    }
                    showErrorToast(error?.response?.data?.message || 'فشل في رفع الوسائط، يرجى المحاولة مرة أخرى.')
                },
            }
        )
    }

    return (
        <div className="bg-[var(--color-surface-card)] p-6 rounded-[18px] shadow-sm border border-[var(--color-border)] mb-6">
            <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-4">رفع وسائط جديدة</h3>
            
            <div 
                className="border-2 border-dashed border-[var(--color-border-muted)] rounded-xl p-8 text-center hover:bg-[var(--color-surface)] transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
            >
                <div className="text-[var(--color-text-muted)] mb-2">
                    <svg className="w-10 h-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                </div>
                <p className="text-sm font-medium text-[var(--color-text-secondary)]">انقر أو اسحب الملفات هنا</p>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">يدعم الصور (JPG, PNG) والفيديو (MP4)</p>
                <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                />
            </div>

            {previews.length > 0 && (
                <div className="mt-6">
                    <h4 className="text-sm font-medium text-[var(--color-text-secondary)] mb-3">الملفات المحددة ({previews.length})</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {previews.map((preview, idx) => (
                            <div key={idx} className="relative group rounded-lg overflow-hidden border border-[var(--color-border)] aspect-square">
                                {preview.type === 'video' ? (
                                    <video src={preview.previewUrl} className="w-full h-full object-cover" />
                                ) : (
                                    <img src={preview.previewUrl} alt={`preview ${idx}`} className="w-full h-full object-cover" />
                                )}
                                <button
                                    onClick={() => removePreview(idx)}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={handleUpload}
                            disabled={isPending}
                            className="bg-[#45592D] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#5D7243] transition-colors disabled:opacity-50"
                        >
                            {isPending ? 'جاري الرفع...' : 'رفع الملفات'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
