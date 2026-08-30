import { motion } from "framer-motion";
import { AccountLayout } from "@/layouts/AccountLayout";
import { CheckCircleIcon, TrashIcon } from "@/components/ui/icons";
import {
  useDeleteNotification,
  useMarkAllAsRead,
  useMarkAsRead,
  useNotifications,
  useUnreadNotificationsCount,
} from "@/features/notifications/hooks/useNotifications";
import type { Notification } from "@/api/notifications";

function formatNotificationDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("ar", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function NotificationsPage() {
  const notificationsQuery = useNotifications();
  const unreadCountQuery = useUnreadNotificationsCount();
  const markAsReadMutation = useMarkAsRead();
  const markAllAsReadMutation = useMarkAllAsRead();
  const deleteNotificationMutation = useDeleteNotification();

  const notifications = notificationsQuery.data ?? [];
  const unreadCount = unreadCountQuery.data ?? notifications.filter((item) => !item.is_read).length;

  return (
    <AccountLayout hideSidebar>
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        dir="rtl"
        className="mx-auto max-w-4xl space-y-6"
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-[#7a7d71]">الإشعارات</p>
            <h1 className="mt-2 text-[32px] font-extrabold text-[#1d2119]">إشعاراتك</h1>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => markAllAsReadMutation.mutate()}
                disabled={markAllAsReadMutation.isPending}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#d8ceb9] px-3 py-1.5 text-[12px] font-medium text-[#4f5f3d] transition-colors hover:bg-[#f2efe9] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <CheckCircleIcon className="h-4 w-4" />
                قراءة الكل
              </button>
            )}
            <span className="rounded-full border border-[#d8ceb9] bg-[#f2efe9] px-3 py-1.5 text-[12px] font-medium text-[#4f5f3d]">
              {unreadCount} جديدة
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {notificationsQuery.isLoading && (
            <div className="rounded-[20px] border border-[#e7dfd4] bg-[#f9f5f1] p-8 text-center text-[#7a7b75]">
              جار تحميل الإشعارات...
            </div>
          )}

          {notificationsQuery.isError && (
            <div className="rounded-[20px] border border-red-200 bg-red-50 p-8 text-center text-red-700">
              تعذر تحميل الإشعارات. يرجى المحاولة مرة أخرى.
            </div>
          )}

          {!notificationsQuery.isLoading && !notificationsQuery.isError && notifications.length === 0 && (
            <div className="rounded-[20px] border border-[#e7dfd4] bg-[#f9f5f1] p-8 text-center text-[#7a7b75]">
              لا توجد إشعارات حالياً.
            </div>
          )}

          {notifications.map((item) => {
            const isUnread = !item.is_read;

            return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex items-start gap-4 rounded-[20px] border p-4 shadow-[0_10px_20px_-18px_rgba(38,47,26,0.2)] ${
                isUnread
                  ? "border-[#dfe7d2] bg-[#f3f7ec]"
                  : "border-[#e7dfd4] bg-[#f9f5f1]"
              }`}
            >
              <div
                className={`mt-1 h-3 w-3 rounded-full ${isUnread ? "bg-[#4f5f3d]" : "bg-[#d4cabd]"}`}
              />

              <div className="flex-1">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-[18px] font-bold text-[#1d2119]">{item.title}</h2>
                  <span className="text-[11px] text-[#7a7b75]">{formatNotificationDate(item.created_at)}</span>
                </div>
                <p className="mt-2 text-[14px] leading-7 text-[#565b53]">{item.body}</p>
                <div className="mt-3 flex items-center gap-3">
                  {isUnread && (
                    <button
                      type="button"
                      onClick={() => markAsReadMutation.mutate(item.id)}
                      disabled={markAsReadMutation.isPending}
                      className="text-[12px] font-semibold text-[#4f5f3d] hover:underline disabled:opacity-50"
                    >
                      تحديد كمقروء
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => deleteNotificationMutation.mutate(item.id)}
                    disabled={deleteNotificationMutation.isPending}
                    className="inline-flex items-center gap-1 text-[12px] font-semibold text-red-700 hover:underline disabled:opacity-50"
                    aria-label="حذف الإشعار"
                  >
                    <TrashIcon className="h-4 w-4" />
                    حذف
                  </button>
                </div>
              </div>
            </motion.div>
            );
          })}
        </div>
      </motion.section>
    </AccountLayout>
  );
}
