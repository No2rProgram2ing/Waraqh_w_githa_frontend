import type { LucideIcon } from 'lucide-react'
import {
  Activity,
  BarChart3,
  Bell,
  Boxes,
  Factory,
  FileText,
  FolderTree,
  Layers3,
  LayoutDashboard,
  MessageSquare,
  Package,
  Palette,
  Settings,
  //ShieldCheck,
  ShoppingCart,
  SlidersHorizontal,
  Users,
  UserCog,
  WalletCards,
} from 'lucide-react'

export type AdminNavigationItem = {
  label: string
  path: string
  icon: LucideIcon
}

export type AdminNavigationSection = {
  label?: string
  items: AdminNavigationItem[]
}

/**
 * Central source of truth for the Admin Dashboard navigation.
 *
 * Do not define Sidebar navigation inside individual pages.
 * Both frontend team members use this same configuration.
 */
export const adminNavigation: AdminNavigationSection[] = [
  {
    items: [
      {
        label: 'الرئيسية',
        path: '/admin/dashboard',
        icon: LayoutDashboard,
      },
      {
        label: 'الطلبات',
        path: '/admin/orders',
        icon: ShoppingCart,
      },
      {
        label: 'التخصيصات',
        path: '/admin/customizations',
        icon: SlidersHorizontal,
      },
      {
        label: 'طلبات التصميم الحر',
        path: '/admin/free-design-requests',
        icon: FileText,
      },
      {
        label: 'الإنتاج',
        path: '/admin/production-stages',
        icon: Factory,
      },
      {
        label: 'المدفوعات',
        path: '/admin/payments',
        icon: WalletCards,
      },
      {
        label: 'المخزون والمواد الخام',
        path: '/admin/raw-materials',
        icon: Boxes,
      },
      {
        label: 'التقارير',
        path: '/admin/reports',
        icon: BarChart3,
      },
      {
        label: 'الإشعارات',
        path: '/admin/notifications',
        icon: Bell,
      },
    ],
  },

  {
    label: 'الكتالوج',
    items: [
      {
        label: 'المنتجات',
        path: '/admin/products',
        icon: Package,
      },
      {
        label: 'فئات المنتجات',
        path: '/admin/product-categories',
        icon: FolderTree,
      },
      {
        label: 'الألوان وأنماط التصميم',
        path: '/admin/design',
        icon: Palette,
      },
      {
        label: 'خصائص المنتجات',
        path: '/admin/product-attributes',
        icon: Layers3,
      },
    ],
  },

  {
    label: 'العملاء',
    items: [
      {
        label: 'العملاء',
        path: '/admin/customers',
        icon: Users,
      },
      {
        label: 'التقييمات والتعليقات',
        path: '/admin/reviews',
        icon: MessageSquare,
      },
    ],
  },

  {
    label: 'إدارة النظام',
    items: [
      {
        label: 'البروفايل الشخصي',
        path: '/admin/profile',
        icon: UserCog,
      },
      /*{
        label: 'المستخدمون الإداريون',
        path: '/admin/admin-users',
        icon: ShieldCheck,
      },
      {
        label: 'الأدوار والصلاحيات',
        path: '/admin/roles',
        icon: ShieldCheck,
      },*/
      {
        label: 'سجل النشاط',
        path: '/admin/activity-logs',
        icon: Activity,
      },
      {
        label: 'إعدادات النظام',
        path: '/admin/settings',
        icon: Settings,
      },
    ],
  },
]