import { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAdminNotifications, useMarkNotificationsAsRead } from '../hooks/useAdminNotifications';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

export function NotificationBell() {
    const { data: notifications = [] } = useAdminNotifications();
    const markAsRead = useMarkNotificationsAsRead();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.length;

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className="relative rounded-xl p-2.5 text-[var(--color-text-muted)] transition-all duration-200 hover:bg-[#45592D]/10 hover:text-[#45592D]"
                aria-label="الإشعارات"
                title="الإشعارات"
            >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute left-0 mt-2 w-80 origin-top-left rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] py-2 shadow-lg ring-1 ring-black/5 z-50">
                    <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 pb-2 pt-1">
                        <h3 className="text-sm font-bold text-[var(--color-text-primary)]">الإشعارات</h3>
                        {unreadCount > 0 && (
                            <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
                                {unreadCount} جديد
                            </span>
                        )}
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="px-4 py-8 text-center text-sm text-[var(--color-text-muted)]">
                                لا توجد إشعارات جديدة.
                            </div>
                        ) : (
                            <ul className="divide-y divide-[var(--color-border)]">
                                {notifications.map((notification) => {
                                    // Parse data if it is returned as a JSON string instead of an object
                                    const parsedData = typeof notification.data === 'string' 
                                        ? JSON.parse(notification.data) 
                                        : (notification.data || {});

                                    return (
                                        <li key={notification.id} className="bg-red-50/30 px-4 py-3 transition-colors hover:bg-[var(--color-surface-subtle)]">
                                            <div className="flex flex-col gap-1">
                                                <p className="text-sm font-medium text-[var(--color-text-primary)]">
                                                    {parsedData.message ?? 'إشعار جديد'}
                                                </p>
                                                <div className="flex items-center justify-between mt-1">
                                                    <span className="text-xs text-[var(--color-text-faint)]">
                                                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true, locale: ar })}
                                                    </span>
                                                    {parsedData.product_id && (
                                                        <Link 
                                                            to={`/admin/products/${parsedData.product_id}`} 
                                                            className="text-xs font-semibold text-[#45592D] hover:underline"
                                                            onClick={() => setIsOpen(false)}
                                                        >
                                                            عرض المنتج
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                    {notifications.length > 0 && (
                         <div className="border-t border-[var(--color-border)] px-4 py-2 text-center">
                            <button 
                                onClick={() => markAsRead.mutate()}
                                disabled={markAsRead.isPending}
                                className="text-xs font-semibold text-[var(--color-text-muted)] hover:text-[#45592D] transition-colors disabled:opacity-50"
                            >
                                {markAsRead.isPending ? 'جاري التحديث...' : 'تعليم الكل كمقروء'}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
