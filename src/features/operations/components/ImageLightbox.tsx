export function ImageLightbox({
  url,
  onClose,
}: {
  url: string
  onClose: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="عرض الصورة"
    >
      <button
        type="button"
        aria-label="إغلاق عرض الصورة"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />

      <div className="relative z-10 max-h-[90vh] max-w-[90vw]">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/20 shadow-2xl">
          <img
            src={url}
            alt="معاينة الصورة"
            className="max-h-[80vh] max-w-full object-contain"
          />
        </div>

        <div className="mt-3 flex justify-center">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-[var(--color-surface-card)] px-4 py-2 text-sm font-medium text-[var(--color-text-primary)] shadow-lg transition-colors hover:bg-[var(--color-surface-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  )
}