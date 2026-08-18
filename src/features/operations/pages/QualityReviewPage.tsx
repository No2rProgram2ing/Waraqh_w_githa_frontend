import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useQualityReviews, useQualityReview } from '../hooks/useQuality'
import { QualityList } from '../components/QualityList'
import { QualityReviewDrawer } from '../components/QualityReviewDrawer'
import { PageHeader } from '@/components/shared/PageHeader'

export default function QualityReviewPage() {
  const [params] = useState({ per_page: 20 })
  const { data } = useQualityReviews(params)
  const reviews = data?.data ?? []

  const [selectedId, setSelectedId] = useState<number | null>(null)
  const { data: selected } = useQualityReview(selectedId)

  return (
    <div dir="rtl" className="space-y-6">
      <Helmet>
        <title>مراجعة الجودة — لوحة الإدارة</title>
      </Helmet>

      <PageHeader title="مراجعة الجودة" />

      <QualityList
        reviews={reviews}
        onOpen={(id) => setSelectedId(id)}
      />

      {selectedId && (
        <QualityReviewDrawer
          review={selected ?? null}
          onClose={() => setSelectedId(null)}
          onUpdated={() => {
            // Refetch handled by React Query cache keys.
          }}
        />
      )}
    </div>
  )
}
