# Operations — النسخة المصححة

تمت إعادة إضافة **طلبات التصميم الحر** وربطها بعقد API حقيقي في Laravel.

## المسارات
- `/admin/orders`
- `/admin/orders/:orderId`
- `/admin/customizations`
- `/admin/customizations/:id`
- `/admin/free-design-requests`
- `/admin/free-design-requests/:id`
- `/admin/payments`
- `/admin/notifications`
- `/admin/raw-materials`
- `/admin/reports`

طلبات التصميم الحر تستخدم:
- GET `/api/admin/custom-design-requests`
- GET `/api/admin/custom-design-requests/{id}`
- PUT `/api/admin/custom-design-requests/{id}`
- DELETE `/api/admin/custom-design-requests/{id}`

ولا يوجد fallback إلى localStorage.

## صفحة مراحل الإنتاج

تمت إعادة إضافة الصفحة:
- `pages/ProductionPage.tsx`

ولعرضها من لوحة الإدارة أضف إلى `AdminRoutes.tsx`:

```tsx
const ProductionPage = lazy(() =>
  import('@/features/operations/pages/ProductionPage')
)
```

ثم داخل `AdminLayout`:

```tsx
<Route path="production-stages" element={<ProductionPage />} />
```

الصفحة تقرأ مراحل الإنتاج من:
- GET `/api/admin/production-stages`

أما تغيير مرحلة طلب فيبقى من تفاصيل الطلب عبر:
- POST `/api/admin/orders/{orderId}/stage/{stageId}`
- POST `/api/admin/orders/{orderId}/next-stage`

## توحيد واجهة المستخدم
تم توحيد واجهة صفحات Operations حول مكونات مشتركة:
- `OpPageHeader` لرؤوس الصفحات.
- `OpCard` و`OpCardSection` للحاويات والأقسام.
- `OpButton` لأزرار الإجراءات والحالات المختلفة.
- `OpEmptyState` لحالات التحميل/الفراغ/الأخطاء.
- `OpStatusBadge` للحالات الموحدة.

كما تم توحيد الجداول، النماذج، تفاصيل الطلبات والمدفوعات، مراحل الإنتاج، الإشعارات، والتخصيصات باستخدام متغيرات التصميم الحالية `--color-*` دون تغيير عقود API الموجودة.

## تحديث UI — البحث والفلترة والتنقل
تم توحيد أدوات الجداول في هذه النسخة:
- مربع بحث موحد `OpSearch` في جداول العمليات.
- فلاتر الحالة/الطريقة حسب نوع الجدول.
- ترقيم صفحات موحد `OpPagination` أسفل الجدول بأرقام الصفحات والسابق/التالي.
- زر `إضافة طلب` في صفحة الطلبات.
- إجراءات الجداول أصبحت أيقونات فقط عبر `OpIconButton` بدون إطار أو خلفية، مع `title` و`aria-label`.
- يشمل ذلك الطلبات، التخصيصات، التصميم الحر، المدفوعات، المواد الخام، الإشعارات، وجدول الطلبات الحديثة في لوحة المعلومات.

## التحديث الحالي — الإضافات الجديدة
- زر **إضافة تخصيص جديد** مع صفحة `CustomizationCreatePage.tsx`.
- زر **تصميم جديد** مع صفحة `FreeDesignCreatePage.tsx`.
- صفحة الإشعارات أصبحت تستخدم `GET /api/admin/notifications` مباشرة لتجنب اعتمادها على طلب profile، مع حالات تحميل/خطأ أوضح.
- المدفوعات: إضافة أيقونات العرض والتعديل والحذف، وإظهار اسم العميل القادم من الطلب.
- المخزون: أيقونات العرض والتعديل والحذف، ونافذة Modal لإضافة/تعديل المادة بدل الفورم الثابت بجانب الجدول.

### المسارات الجديدة في Frontend
أضف الصفحات الجديدة إلى `AdminRoutes.tsx`:
```tsx
<Route path="customizations/new" element={<CustomizationCreatePage />} />
<Route path="free-design-requests/new" element={<FreeDesignCreatePage />} />
```
ثم أضف الاستيرادات المناسبة للصفحتين.

### Backend الذي يجب إضافته
الملفات الموجودة في حزمة Backend Patch هي فقط الملفات التي تغيرت/أضيفت لدعم هذه الوظائف، ولا تحتاج إلى استبدال المشروع كاملًا.
