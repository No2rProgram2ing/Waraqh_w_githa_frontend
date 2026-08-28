export interface OrderItem {
  id: string;
  year: string;
  month: string;
  price: string;
  status: "تم التسليم" | "قيد التنفيذ" | "ملغي";
  isActive?: boolean;
}
