# Request: Reports export and dashboard statistics endpoints

مرحبًا فريق الباك،

نحتاج مجموعة من endpoints لدعم صفحة "التقارير" في لوحة الإدارة وتحسين دقة اللوحة العامة (Dashboard). الرجاء مراجعة التفاصيل أدناه ورفع أي أسئلة.

1) GET /api/admin/reports
- Query params:
  - from (optional) — تاريخ بداية
  - to (optional) — تاريخ نهاية
  - granularity (optional) — daily|weekly|monthly (default daily)
- Response (200):

```json
{
  "data": [
    { "date": "2026-07-01", "orders": 5, "revenue": 1250, "avg_value": 250 },
    ...
  ],
  "kpi": { "total_orders": 1250, "total_revenue": 142500, "avg_order_value": 114 },
  "meta": { "total": 30 }
}
```

2) GET /api/admin/reports/export?type=pdf|csv&from=&to=
- Should return blob (application/pdf or text/csv). Prefer server-side generation for PDF export.

3) GET /api/admin/dashboard/statistics?days=30
- As documented previously (total_revenue, sales_timeseries, orders_statistics, featured_products)

ملاحظات:
- إن أمكن، أرسِل أمثلة JSON حقيقية للوصول إلى الحقول المذكورة أعلاه.
- سأربط الواجهات بالـendpoints فور توافرها؛ حالياً قمت بعمل fallbacks بسيطة في الواجهة حيث أمكن.

شكراً، الرجاء إعلامي عند توفر الـendpoints لأقوم بعمل اختبار end‑to‑end وربط التصدير PDF.
