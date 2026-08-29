# Frontend Architecture Rules — React + Vite + TS Admin Panel

> هذا الملف هو "الدستور" الدائم لهذا المستودع.
> اقرأه والتزم به قبل أي تعديل أو إضافة كود.
> هذا المستودع **مستقل تمامًا** عن الـ Backend (repo منفصل)، لا تخلط بينهما.

---

## 0. Stack

- React + Vite + TypeScript
- Tailwind CSS v4
- React Router
- TanStack React Query
- Axios
- **Feature-based Architecture**

---

## 1. البنية الحالية (لا تُعاد صياغتها)

```
src/features/<feature-name>/
   ├── api/          → استدعاءات axios فقط
   ├── hooks/         → React Query hooks (useQuery / useMutation)
   ├── types/         → TypeScript types/interfaces
   ├── pages/          → الصفحات (routes)
   └── components/     → مكونات خاصة بالـ feature
```

- الاتصال بـ Admin API عبر `axiosAdminClient` فقط (Admin Sanctum Auth).
- Query keys بنمط: `['admin', '<resource>', id?]`

---

## 2. Feature قائم كمرجع: `features/catalog`

هذا الـ Feature الأكثر اكتمالًا حاليًا، استخدمه كنموذج (pattern) لأي feature جديد.

**موجود فعليًا الآن (لا تُعاد بناؤه):**
- `productsApi.ts`: `getAll()` (pagination+search), `getById(id)`, `update(id, data)`
- Types: `Product`, `ProductStatus`, `ProductMedia`, `ProductMediaType ('image'|'video')`
- `useProduct(id)` → `queryKey: ['admin','product', id]`
- `useUpdateProduct` → ينقل لصفحة التفاصيل بعد النجاح
- `ProductTable.tsx`, `ProductDetailsPage.tsx`, `ProductEditPage.tsx`

**ناقص/غير مكتمل حاليًا:**
- عرض media (صور/فيديو) في `ProductDetailsPage`
- Product Media Upload كامل (اختيار متعدد، Preview، رفع فعلي، حذف، ترتيب، صورة رئيسية)
- الباك حاليًا يستقبل `url` نصي فقط لـ ProductMedia (سيتغير لاحقًا مع الباك)

---

## 3. قواعد صارمة

- ❌ لا تعيد بناء ملفات/صفحات موجودة من الصفر — وسّع أو عدّل فقط.
- ❌ لا تضع منطق رفع ملفات أو business logic داخل الصفحات (Pages) مباشرة — يجب أن يكون داخل `hooks/` + `api/`.
- ❌ لا تخترع بنية مجلدات جديدة لكل feature — التزم بنمط `catalog` أعلاه.
- ❌ لا تستخدم أي state management إضافي (Redux/Zustand) إلا بطلب صريح — React Query يكفي لحالة السيرفر.
- ✅ كل feature جديد يتبع نفس هيكل `features/<name>/{api,hooks,types,pages,components}`.
- ✅ Tailwind v4 فقط للتنسيق، بدون مكتبات UI إضافية إلا بطلب صريح.

---

## 4. نطاق الشاشات المطلوبة (Admin Panel)

| الشاشة | الوصف | الأولوية |
|---|---|---|
| إدارة المنتجات | جدول رئيسي + إضافة (فورم متعدد خطوات) | عالية (جزئيًا جاهز) |
| Product Media | رفع/معاينة/ترتيب/حذف صور وفيديو | عالية (نشط الآن) |
| إدارة فئات المنتجات | Tree View هرمي | متوسطة |
| الألوان والأنماط | تبويبين (ألوان/أنماط) | متوسطة |
| خصائص/سمات المنتج | جدول + Popup ديناميكي | متوسطة |
| إدارة العملاء | قائمة + تبويبات ملف العميل | متوسطة |
| إضافة عميل | فورم | منخفضة |
| مراجعة التقييمات | مراجعة تعليقات العملاء | منخفضة |
| إدارة المستخدمين الإداريين | تبويبات حالة + رد | متوسطة |
| البروفايل الشخصي للأدمن | صفحة إعدادات حساب | منخفضة |
| الأدوار والصلاحيات | جدول + Accordion | متوسطة |
| سجل النشاط | جدول Timeline | منخفضة (عرض فقط) |
| إعدادات النظام العامة | تبويبات إنتاج/شحن/دفع | منخفضة |

---

## 5. خطة Product Media (تفصيل)

المطلوب داخل `features/catalog/`:

- `api/productMediaApi.ts`
  - `upload(productId, files: File[])` → `multipart/form-data`
  - `remove(productId, mediaId)`
  - `reorder(productId, orderedIds: number[])`
  - `setPrimary(productId, mediaId)`
- `hooks/`
  - `useUploadProductMedia()`
  - `useDeleteProductMedia()`
  - `useReorderProductMedia()`
  - `useSetPrimaryProductMedia()`
- `components/media/`
  - `MediaUploader.tsx` → اختيار ملفات متعددة (صور/فيديو) + Preview قبل الرفع (باستخدام `URL.createObjectURL`)
  - `MediaGallery.tsx` → عرض، سحب وترتيب (drag & drop)، تحديد رئيسية، حذف
- الدمج داخل `ProductEditPage.tsx` كـ **Section مستقل**، وليس منطقًا مدمجًا بالصفحة.

⚠️ ملاحظة: الباك حاليًا يستقبل `url` فقط. اجعل الواجهة (UI/UX + state) جاهزة بالكامل الآن، مع طبقة `api` مبنية لاستقبال `FormData` — بحيث عند اكتمال endpoint الرفع في الباك، يكون التعديل المطلوب في الفرونت بسيط (تغيير جسم الطلب فقط، بدون إعادة بناء المكونات).

---

## 6. قاعدة العمل مع أي طلب جديد

1. افحص الـ feature الموجود فعليًا أولًا (لا تفترض).
2. اعرض خطة نصية مختصرة (ملفات ستُنشأ/تُعدَّل) قبل التنفيذ.
3. اتبع نمط `catalog` تمامًا لأي feature جديد.
4. لا تُدخل مكتبات جديدة بدون إذن صريح.
5. لا تلمس منطق الـ Backend من هذا المستودع — هما مستقلان تمامًا.
