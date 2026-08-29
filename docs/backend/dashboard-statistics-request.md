# Request: Dashboard statistics endpoint

مرحبًا فريق الباك‌إند،

نحتاج endpoint واحد موحّد لعرض إحصاءات لوحة الإدارة (Dashboard) بشكلٍ فعّال وسريع. هذه الواجهة تستخدمها صفحة الإدارة لعرض بطاقات KPI ومخطط المبيعات والمنتجات المميزة.

- Endpoint (مقترح):
  - Method: GET
  - Path: /api/admin/dashboard/statistics
  - Query params:
    - days (optional) — عدد الأيام لعرض السلاسل الزمنية (default: 30)

- المطلوب في response (JSON):

```json
{
  "data": {
    "total_revenue": 142500,
    "currency": "SAR",
    "sales_timeseries": [
      { "date": "2026-07-19", "revenue": 4500, "orders_count": 4 },
      { "date": "2026-07-20", "revenue": 3800, "orders_count": 3 }
    ],
    "orders_statistics": {
      "total_orders": 1250,
      "pending": 48,
      "production": 156,
      "quality_pending": 12,
      "completed": 980
    },
    "featured_products": [
      { "id": 12, "name": "سلة يدوية", "price": 450, "media": [{ "url": "..." }] }
    ]
  }
}
```

- ملاحظات:
  - الحقول `sales_timeseries` و `total_revenue` ضرورية لعرض المخطط وبطاقة إجمالي المبيعات.
  - الحقل `featured_products` اختياري لكنه يساعد في تعبئة قسم "المنتجات المميزة" دون استدعاء إضافي.
  - في حال عدم إمكانية توفير `sales_timeseries` فورًا، يرجى على الأقل إضافة `total_revenue` إلى endpoint الموجود `/admin/orders-statistics` كحل مرحلي.

شكراً، الرجاء إعلامي عند توفر الـendpoint لأقوم بربط الـDashboard بشكل كامل.
