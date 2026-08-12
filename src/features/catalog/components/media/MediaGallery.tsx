import { useState, useEffect } from 'react'
import type { ProductMedia } from '../../types/product-media'
import { 
    useProductMedia, 
    useDeleteProductMedia, 
    useReorderProductMedia, 
    useSetPrimaryProductMedia 
} from '../../hooks/useProductMedia'
import { Star, Trash2 } from 'lucide-react'

interface MediaGalleryProps {
    productId: number
}

export default function MediaGallery({ productId }: MediaGalleryProps) {
    const { data: mediaList, isLoading } = useProductMedia(productId)
    const { mutate: deleteMedia } = useDeleteProductMedia()
    const { mutate: reorderMedia } = useReorderProductMedia()
    const { mutate: setPrimaryMedia } = useSetPrimaryProductMedia()

    const [items, setItems] = useState<ProductMedia[]>([])
    const [draggedId, setDraggedId] = useState<number | null>(null)

    useEffect(() => {
        if (mediaList) {
            const sorted = [...mediaList].sort((a, b) => a.sort_order - b.sort_order)
            setItems(sorted)
        }
    }, [mediaList])

    const handleDragStart = (e: React.DragEvent, id: number) => {
        setDraggedId(id)
        e.dataTransfer.effectAllowed = 'move'
    }

    const handleDragOver = (e: React.DragEvent, id: number) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
        
        if (draggedId === null || draggedId === id) return

        const draggedIndex = items.findIndex((item) => item.id === draggedId)
        const targetIndex = items.findIndex((item) => item.id === id)

        if (draggedIndex === -1 || targetIndex === -1) return

        const newItems = [...items]
        const [draggedItem] = newItems.splice(draggedIndex, 1)
        newItems.splice(targetIndex, 0, draggedItem)

        setItems(newItems)
    }

    const handleDragEnd = () => {
        setDraggedId(null)
        const currentOrderedIds = items.map(i => i.id)
        const originalOrderedIds = [...(mediaList || [])].sort((a, b) => a.sort_order - b.sort_order).map(i => i.id)
        
        const isChanged = currentOrderedIds.some((id, idx) => id !== originalOrderedIds[idx])
        if (isChanged) {
            reorderMedia({ productId, orderedIds: currentOrderedIds })
        }
    }

    if (isLoading) {
        return <div className="p-4 text-[var(--color-text-muted)] text-sm">جاري تحميل الوسائط...</div>
    }

    if (!items.length) {
        return (
            <div className="bg-[var(--color-surface)] p-12 rounded-2xl border border-dashed border-[var(--color-border-muted)] text-center text-[var(--color-text-muted)] text-sm">
                لا توجد صور أو فيديوهات لهذا المنتج.
            </div>
        )
    }

    return (
        <div className="bg-[var(--color-surface-card)] p-6 rounded-[18px] shadow-sm border border-[var(--color-border)]">
            <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-4">الوسائط الحالية</h3>
            <p className="mt-1 text-sm text-[var(--color-text-muted)] mb-6">اسحب لترتيب الصور، أو انقر على النجمة لتعيين الصورة الرئيسية.</p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                {items.map((media) => (
                    <div 
                        key={media.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, media.id)}
                        onDragOver={(e) => handleDragOver(e, media.id)}
                        onDragEnd={handleDragEnd}
                        className={`relative group rounded-2xl overflow-hidden border bg-[var(--color-surface)] cursor-move aspect-square transition-all ${
                            media.is_primary ? 'border-[#45592D] shadow-sm ring-1 ring-[#45592D]' : 'border-[var(--color-border)]'
                        } ${draggedId === media.id ? 'opacity-50' : 'opacity-100'}`}
                    >
                        {media.media_type === 'video' ? (
                            <video src={media.url} className="w-full h-full object-cover pointer-events-none" />
                        ) : (
                            <img src={media.url} alt={`media ${media.id}`} className="w-full h-full object-cover pointer-events-none" />
                        )}
                        
                        {media.is_primary && (
                            <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-[var(--color-surface-card)]/95 px-3 py-1.5 text-xs font-semibold text-[#45592D] shadow-sm">
                                <Star size={13} fill="currentColor" />
                                رئيسية
                            </div>
                        )}

                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            {!media.is_primary && (
                                <button
                                    onClick={() => setPrimaryMedia({ productId, mediaId: media.id })}
                                    className="bg-[var(--color-surface-card)] text-[#45592D] p-2 rounded-full hover:bg-[var(--color-accent-subtle)] transition-colors"
                                    title="تعيين كرئيسية"
                                >
                                    <Star size={16} />
                                </button>
                            )}
                            <button
                                onClick={() => {
                                    if(confirm('هل أنت متأكد من حذف هذه الوسيلة؟')) {
                                        deleteMedia(media.id)
                                    }
                                }}
                                className="bg-[#A04A3A] text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                                title="حذف"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
