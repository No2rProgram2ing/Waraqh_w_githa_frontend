import React, { useRef, useState } from 'react'

export function CustomizationImageUploader({ onChange }: { onChange: (files: File[]) => void }) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [previews, setPreviews] = useState<string[]>([])

  const handleFiles = (files: FileList | null) => {
    if (!files) return
    const arr = Array.from(files)
    setPreviews(arr.map((f) => URL.createObjectURL(f)))
    onChange(arr)
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-3">
        <button onClick={() => inputRef.current?.click()} className="rounded-md border px-3 py-2">رفع صور</button>
        <input ref={inputRef} type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleFiles(e.target.files)} />
      </div>

      <div className="flex gap-2">
        {previews.map((p, i) => (
          <img key={i} src={p} className="h-20 w-20 object-cover rounded-md" alt={`preview-${i}`} />
        ))}
      </div>
    </div>
  )
}
