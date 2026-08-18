# PR Draft: Visual polish (Phase 1)

الغرض: بدء تحسين مرئي منسق للواجهات المنفذة حاليًا (Dashboard, Payments, Orders, Create Customization). هذا الملف يشرح التغييرات التي سأجمعها في PR1 ويوجّه المراجعين إلى نقاط التركيز.

ما سيحتويه PR1 (polish-dashboard-payments-orders-customization):

- تحسينات عامة
  - مطابقة spacing والطباعة (font-size / line-height) مع الفِجما.
  - توحيد ألوان البطاقات (backgrounds) وتدرجات الظلال (shadows) لجميع الـCards.
  - إضافة skeletons محسّنة للـtables والمخطط.
  - تحسين RTL fixes (text alignment, direction on numeric fields داخل البطاقات).
  - تحسين الحركات الخفيفة باستخدام framer-motion لدخول المكونات وhover effects.

- Dashboard
  - إصلاح تباعد العناوين والنِسق العام.
  - تحسين tooltip/tooltip formatting في المخطط.
  - إضافة responsive tweaks (mobile/tablet) لcarousel والـKPI cards.

- Payments
  - تنسيق رؤوس الأعمدة والـbadges (colors + border-radius).
  - تحسين زر التصدير ومكانه مع aria-labels.
  - إضافة table skeleton لعرض حمل البيانات.

- Orders
  - تحسين عرض الـtimeline داخل drawer (مراحل الإنتاج) مع علامات حالة واضحة.
  - ضبط spacing لعرض عناصر الطلب داخل drawer.

- Create Customization
  - تحسين تخطيط النموذج، spacing بين الحقول، وإبراز زر "احسب السعر" و"إرسال".
  - تحسين card الملخّص الجانبي لكونه أكثر وضوحًا في الهواتف.
  - حفظ المسودة: تحسين رسائل toast وموقع الزر.

قائمة الملفات الرئيسية المتوقعة في PR1:
- src/features/operations/pages/DashboardPage.tsx
- src/features/operations/components/DashboardSalesChart.tsx
- src/features/operations/components/DashboardKpiCard.tsx
- src/features/operations/components/FeaturedProductsCarousel.tsx
- src/features/operations/components/DashboardSkeleton.tsx
- src/features/operations/pages/PaymentsPage.tsx
- src/features/operations/components/PaymentsTable.tsx
- src/features/operations/components/PaymentDetailsDrawer.tsx
- src/features/operations/pages/OrdersPage.tsx
- src/features/operations/components/OrdersTable.tsx
- src/features/operations/components/OrderDetailsDrawer.tsx
- src/features/operations/pages/CreateCustomizationPage.tsx
- src/features/operations/components/CustomizationForm.tsx
- src/features/operations/components/CustomizationPriceSummary.tsx
- src/features/operations/components/CustomizationImageUploader.tsx

ملاحظات للـBackend (ستُذكر في PR description):
- endpoint المستحسن dashboard/statistics (لإظهار إجمالي الإيرادات والمخططات).
- endpoint estimate للـcustomizations لتحسين دقة الحسابات.
- تأكيد الحقول في GET /admin/payments و /admin/orders لتوافق حقول الـtypes المستخدمة.

خطة العمل بعد فتح PR1:
1. أضغط PR1 وأدرجه كـdraft PR على GitHub لسهولة المراجعة.
2. أرفق لقطات شاشة "قبل/بعد" لكل صفحة.
3. بعد المراجعة أستكمل PR2.. بناءً على التعليقات سأطبق التعديلات اللازمة.

