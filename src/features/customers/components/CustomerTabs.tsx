import { useState } from 'react'
import type { CustomerDetails } from '../types/customer'

interface CustomerTabsProps {
    customer: CustomerDetails
}

type TabType = 'orders' | 'addresses' | 'reviews'

export default function CustomerTabs({ customer }: CustomerTabsProps) {
    const [activeTab, setActiveTab] = useState<TabType>('orders')
    const addresses = Array.isArray(customer.addresses) ? customer.addresses : []

    return (
        <div dir="rtl" className="bg-[var(--color-surface-card)] rounded-[24px] border border-[var(--color-border)] overflow-hidden">
            {/* Tabs Header */}
            <div className="border-b border-[var(--color-border)] px-6">
                <nav className="flex gap-8">
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`pt-6 pb-4 text-sm font-semibold transition-colors relative ${
                            activeTab === 'orders' ? 'text-[#45592D]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
                        }`}
                    >
                        الطلبات السابقة
                        {activeTab === 'orders' && (
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#45592D] rounded-t-full" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('addresses')}
                        className={`pt-6 pb-4 text-sm font-semibold transition-colors relative ${
                            activeTab === 'addresses' ? 'text-[#45592D]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
                        }`}
                    >
                        العناوين
                        {activeTab === 'addresses' && (
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#45592D] rounded-t-full" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('reviews')}
                        className={`pt-6 pb-4 text-sm font-semibold transition-colors relative ${
                            activeTab === 'reviews' ? 'text-[#45592D]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
                        }`}
                    >
                        التقييمات
                        {activeTab === 'reviews' && (
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#45592D] rounded-t-full" />
                        )}
                    </button>
                </nav>
            </div>

            {/* Tabs Content */}
            <div className="p-6">
                {activeTab === 'orders' && (
                    <div className="text-center py-12 text-[var(--color-text-muted)] text-sm bg-[var(--color-surface)] rounded-xl border border-dashed border-[var(--color-border-muted)]">
                        سجل الطلبات فارغ أو غير متوفر حالياً بانتظار ربط ميزة الطلبات.
                    </div>
                )}
                
                {activeTab === 'addresses' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {!addresses.length ? (
                            <div className="col-span-full text-center py-12 text-[var(--color-text-muted)] text-sm bg-[var(--color-surface)] rounded-xl border border-dashed border-[var(--color-border-muted)]">
                                لا توجد عناوين مسجلة لهذا العميل.
                            </div>
                        ) : (
                            addresses.map((address) => (
                                <div key={address.id} className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] relative">
                                    {address.is_default && (
                                        <span className="absolute top-4 left-4 inline-flex items-center justify-center rounded-full bg-[var(--color-surface-subtle)] border border-[var(--color-border)] px-2 py-0.5 text-[10px] font-bold text-[var(--color-text-secondary)]">
                                            الافتراضي
                                        </span>
                                    )}
                                    <h3 className="font-semibold text-sm text-[var(--color-text-primary)] mb-2">{address.title}</h3>
                                    <p className="text-sm text-[var(--color-text-secondary)] mb-1">{address.address_line_1}</p>
                                    <p className="text-xs text-[var(--color-text-muted)]">{address.city}، {address.country}</p>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'reviews' && (
                    <div className="text-center py-12 text-[var(--color-text-muted)] text-sm bg-[var(--color-surface)] rounded-xl border border-dashed border-[var(--color-border-muted)]">
                        لا توجد تقييمات مسجلة لهذا العميل.
                    </div>
                )}
            </div>
        </div>
    )
}
