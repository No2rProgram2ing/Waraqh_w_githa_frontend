import type { OrderItem } from "@/features/orders/types";

export const orders: OrderItem[] = [
  {
    id: "WJ-8942#",
    slug: "WJ-8942",
    year: "2023",
    month: "12",
    price: "1,250.00",
    status: "تم التسليم",
    isActive: true,
    items: [
      { id: "p1", name: "منصة خشبية فاخرة", quantity: 1, unitPrice: "1,250.00" },
    ],
  },
  {
    id: "WJ-8721#",
    slug: "WJ-8721",
    year: "2023",
    month: "05",
    price: "4,800.00",
    status: "قيد التنفيذ",
    items: [
      { id: "p2", name: "طاولة وركيزة", quantity: 1, unitPrice: "3,000.00" },
      { id: "p3", name: "قطع تشطيب إضافية", quantity: 1, unitPrice: "1,800.00" },
    ],
  },
  {
    id: "WJ-8502#",
    slug: "WJ-8502",
    year: "2023",
    month: "22",
    price: "920.00",
    status: "قيد التنفيذ",
    items: [
      { id: "p4", name: "خدمة تجليد", quantity: 2, unitPrice: "460.00" },
    ],
  },
];
