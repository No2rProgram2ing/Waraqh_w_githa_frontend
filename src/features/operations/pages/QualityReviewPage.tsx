import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import { useQualityReviews, useQualityReview } from '../hooks/useQuality'
import { QualityList } from '../components/QualityList'
import { QualityReviewDrawer } from '../components/QualityReviewDrawer'

export default function QualityReviewPage(){
  const [params] = useState({ per_page: 20 })
  const { data } = useQualityReviews(params)
  const reviews = data?.data ?? []

  const [selectedId, setSelectedId] = useState<number | null>(null)
  const { data: selected } = useQualityReview(selectedId)

  return (
    <div dir="rtl" className="space-y-6">
      <Helmet><title>مراجعة الجودة — لوحة الإدارة</title></Helmet>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">مراجعة الجودة</h1>
      </div>

      <div>
        <QualityList reviews={reviews} onOpen={(id) => setSelectedId(id)} />
        {selectedId && <QualityReviewDrawer review={selected ?? null} onClose={() => setSelectedId(null)} onUpdated={() => {/* refetch handled by react-query cache keys */}} />}
      </div>
    </div>
  )
}
