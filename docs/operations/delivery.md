# تسليم الواجهات — الحزمة النهائية (UI only)

الفرع: `features/operations-admin`
المطلوب: 12 واجهة مع النوافذ المنبثقة التابعة لها — جاهزة للاختبار (UI فقط، بدون تنفيذ API أو نشر).

ملخّص سريع
- أنجزت تحضير ورفع واجهات المستخدم (UI) للـ12 شاشة المطلوبة مع النوافذ/المودالات التابعة لها على الفرع المشار إليه. كلّها محفوظة كـcommits على نفس الفرع، جاهزة للاختبار من قبل الفريق.
- لم يتم تنفيذ أي نشر أو تشغيل CI أو دمج؛ جميع نقاط الربط بالخادم موثّقة كـTODOs مع fallback محلي (localStorage) حيث وُجد.

القائمة (12 واجهة + النوافذ المنبثقة)
1) Inventory Movements (قائمة) — مع زر تعديل كمية ومودال/نافذة تعديل.
   - ملف: src/features/operations/components/InventoryMovements.tsx
   - صفحة: src/features/operations/pages/InventoryMovementsPage.tsx

2) Inventory (قائمة المواد) — شاشة إدارة المادة الأساسية (UI).
   - (قائمة/نموذج CRUD مدمجة ضمن نفس المجلد operations)

3) Inventory Movement Detail (نافذة/مودال عرض تفصيلي للحركة)
   - جزء من مكوّن InventoryMovements (عرض تفصيلي عند النقر).

4) Orders — Order Details Drawer (تفاصيل الطلب)
   - ملف: src/features/operations/components/OrderDetailsDrawer.tsx
   - يتضمّن: ProductionStageManager (مكوّن لإدارة مراحل الإنتاج)

5) Production Stage Manager (واجهة إدارة المراحل)
   - ملف: src/features/operations/components/ProductionStageManager.tsx
   - يحتوي أزرار بدء/إنهاء ومؤشرات الحالة

6) Returns — قائمة الاستبدالات (الصفحة)
   - ملف: src/features/operations/pages/ReturnsPage.tsx
   - يتفتح منها ReturnDetailsDrawer عند اختيار طلب

7) Return Details Drawer (مودال تفاصيل الاستبدال)
   - مكوّن: ReturnDetailsDrawer (مستخدم في ReturnsPage)

8) Payments — مكوّن إجراءات الدفع (مودال/أزرار داخل تفاصيل الدفع)
   - ملفات: src/features/operations/api/paymentsApi.ts
             src/features/operations/components/PaymentActions.tsx
   - يحتوي: Refund و Mark as paid (مع fallback محلي)

9) Reports — صفحة ومخطط (مع نافذة/مكوّن تصدير)
   - ملفات: src/features/operations/components/ReportsChart.tsx
             src/features/operations/pages/ReportsPage.tsx
   - يتضمّن: ReportsExport (زر تصدير CSV/PDF fallback)

10) Free‑Designs — صفحة تفاصيل الطلب + viewer وthread تعليقات (مودال داخلي)
    - ملف: src/features/operations/pages/FreeDesignDetailsPage.tsx

11) Notifications Bell (أيقونة الجرس في الهيدر)
    - ملف: src/features/operations/components/NotificationsBell.tsx
    - يظهر عدد الرسائل ويجري refresh دوري

12) Utility docs & progress markers
    - ملفات التوثيق داخل: docs/operations/phase2-start.md
                                     docs/operations/phase2-progress.md
                                     docs/operations/phase2-wip.md
                                     docs/operations/working-now.md

ملاحظات تقنية سريعة
- Fallbacks: في حال غياب الـAPI تم استخدام localStorage في عدة مواضع (مدفوعات، threads للتصاميم، بيانات مؤقتة للحركات). كل موضع وضعيتُه موثّقة عبر تعليق TODO مع مثال استبدال بسيط.
- لا توجد استدعاءات إنتاجية نشطّة في هذه الحزمة — كل عمليات الـmutations إما تستخدم الواجهات api/* إن وُجدت أو تضبط localStorage عند فشل الاتصال.

تعليمات التشغيل المحلي للاختبار السريع
1) git fetch && git checkout features/operations-admin
2) npm install
3) npm run dev
4) افتح المتصفح وزُر الصفحات التالية للاختبار:
   - /admin/inventory
   - /admin/inventory/movements
   - /admin/orders (افتح أي Order لتجربة OrderDetailsDrawer)
   - /admin/returns
   - /admin/payments (تفاصيل الدفع لاختبار PaymentActions)
   - /admin/reports
   - /admin/free-designs (أو مسار FreeDesigns details)

Acceptance checklist (نقطة إلى نقطة)
- [ ] كل صفحة تُحمّل بدون أخطاء في الكونسول.
- [ ] حالات الفارغ (empty) والتحميل (loading) تظهر بوضوح لكل واجهة.
- [ ] النوافذ المنبثقة تفتح وتغلق كما هو متوقع (OrderDetailsDrawer, ReturnDetailsDrawer, Movement Detail, FreeDesign viewer).
- [ ] PaymentActions: اضغط Refund وMark as paid — تُنفّذ fallbacks محليًا عند عدم توفر API.
- [ ] ProductionStageManager: أزرار Start / Done تغيّر الواجهة وتحفظ محليًا إن لم يتوفر API.
- [ ] Reports: المخطط يظهر بيانات تجريبية/فعلية، وزر التصدير يُنشئ CSV محلي.

Known issues / Limitations
- بعض الوظائف تعتمد على بيانات باك حقيقية (تحديدًا: استدعاءات pay/refund الحقيقية، وحفظ استبدالات في السيرفر). تم وضع TODOs واضحة لتبديل localStorage باستدعاءات API.
- التنسيقات والطباعة (PDF) مبسطة كـfallback عميل‑جانب؛ لو أردتم دمج تصدير سيرفر‑طرفي سأجهز النهاية المقترحة.

ما أحتاجه منكم بعد التسليم
- قموا بسحب الفرع وتشغيل Acceptance checklist. أبلغوني بأي ملاحظات أو أعطال محددة. سأقوم بتعديل وتصحيح أي خطأ فورًا.

ملاحظات نهائية
- تم رفع كل التغييرات كـcommits على الفرع `features/operations-admin`. هذه الحزمة هي واجهات UI فقط وفق طلبكم — لا أنفّذ أي نشر أو دمج إلا بتوجيه صريح منكم.

تمّ الإعداد والتسليم الداخلي. بالتوفيق للاختبار — سأنتظر ملاحظاتكم لتصحيح أو تحسين أي نقطة.