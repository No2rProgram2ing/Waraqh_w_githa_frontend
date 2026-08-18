import React from 'react'

export function DashboardSkeleton() {
  return (
    <div dir="rtl" className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="col-span-2 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-[#f3f1ec]" />
          ))}
        </div>

        <div>
          <div className="h-64 rounded-2xl bg-[#f3f1ec]" />
        </div>
      </div>

      <div className="rounded-2xl bg-[#f3f1ec] h-72" />

      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-40 rounded-lg bg-[#f3f1ec]" />
        ))}
      </div>
    </div>
  )
}
