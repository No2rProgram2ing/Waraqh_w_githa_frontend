import { useState } from 'react'
import ColorsTab from '../components/colors/ColorsTab'
import PatternsTab from '../components/patterns/PatternsTab'

type TabType = 'colors' | 'patterns'

export default function DesignPage() {
    const [activeTab, setActiveTab] = useState<TabType>('colors')

    return (
        <div dir="rtl" className="space-y-6">
            <div>
                <h1 className="text-[28px] font-extrabold text-[var(--color-text-primary)]">الألوان وأنماط التصميم</h1>
                <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                    إدارة الألوان المتاحة للمنتجات وصور أنماط التصميم المختلفة
                </p>
            </div>

            <div className="border-b border-[var(--color-border)]">
                <nav className="flex gap-6">
                    <button
                        onClick={() => setActiveTab('colors')}
                        className={`pb-4 text-sm font-semibold transition-colors relative ${
                            activeTab === 'colors' ? 'text-[#45592D]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
                        }`}
                    >
                        الألوان
                        {activeTab === 'colors' && (
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#45592D] rounded-t-full" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('patterns')}
                        className={`pb-4 text-sm font-semibold transition-colors relative ${
                            activeTab === 'patterns' ? 'text-[#45592D]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
                        }`}
                    >
                        أنماط التصميم
                        {activeTab === 'patterns' && (
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#45592D] rounded-t-full" />
                        )}
                    </button>
                </nav>
            </div>

            <div className="pt-2">
                {activeTab === 'colors' ? <ColorsTab /> : <PatternsTab />}
            </div>
        </div>
    )
}
