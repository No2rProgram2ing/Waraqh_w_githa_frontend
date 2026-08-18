import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/Button'

export function CustomizationImageUploader({
  onChange,
}: {
  onChange: (files: File[]) => void
}) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [previews, setPreviews] = useState<string[]>([])

  const handleFiles = (files: FileList | null) => {
    if (!files) return

    const nextFiles = Array.from(files)
    const nextPreviews = nextFiles.map((file) =>
      URL.createObjectURL(file),
    )

    setPreviews((currentPreviews) => {
      currentPreviews.forEach((preview) => URL.revokeObjectURL(preview))
      return nextPreviews
    })

    onChange(nextFiles)
  }

  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview))
    }
  }, [previews])

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => inputRef.current?.click()}
        >
          رفع صور
        </Button>

        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(event) => handleFiles(event.target.files)}
        />
      </div>

      {previews.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {previews.map((preview, index) => (
            <div
              key={`${preview}-${index}`}
              className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)]"
            >
              <img
                src={preview}
                alt={`معاينة الصورة ${index + 1}`}
                className="aspect-square h-auto w-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}