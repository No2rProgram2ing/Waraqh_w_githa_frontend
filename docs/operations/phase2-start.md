# بدء المرحلة الثانية — تنفيذ الواجهات المتبقية

المشروع: features/operations-admin
الوقت: 2026-08-17T21:12:00Z

هذا الملف مُضاف تلقائيًا لتسجيل بداية "الدفعة النهائية" (Phase 2) والتي تتضمن:

- Inventory: استكمال CRUD، شاشة Movements مفصّلة، تعديل/حذف حركة، تحسين UX.
- Orders: إدارة مراحل الإنتاج متقدمة داخل تفاصيل الطلب (بدائل الحفظ محليًا مع نقاط تبديل للـAPI).
- Returns: إكمال workflow (approve/reject + تعليقات + persist محلي).
- Payments: إجراءات Refund، Mark as paid، وتحسين Export (PDF/CSV fallback).
- Reports: رسوم بيانية تفاعلية (apexcharts) + فلترة متقدّمة + تحسين export.
- Free‑Designs: صفحة تفاصيل، عرض المرفقات، thread تعليقات محلي.
- Notifications: أيقونة جرس، تحديث دوري، ربط التنقّل.
- CI + اختبارات smoke + فحص RTL & accessibility نهائي.

المهمة التالية: تنفيذ Inventory (Movements مفصّلة + تحسين CRUD). 

سأتابع العمل على الملفات source داخل src/features/operations/ وسأبلغك عند اكتمال كل مجموعة، ثم أختم بتسليمٍ واحدٍ موحّد كما اتفقنا.