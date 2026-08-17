import React from 'react'

export function ImageLightbox({ url, onClose }: { url: string; onClose: () => void }){
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60">
      <div className="max-w-[90%] max-h-[90%]">
        <img src={url} alt="lightbox" className="object-contain max-h-[90vh] mx-auto" />
        <div className="text-center mt-3">
          <button onClick={onClose} className="rounded-md bg-white px-3 py-2">إغلاق</button>
        </div>
      </div>
    </div>
  )
}
