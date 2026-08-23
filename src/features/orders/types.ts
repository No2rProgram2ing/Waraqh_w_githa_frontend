export interface OrderProduct {
  id: string;
  name: string;
  quantity: number;
  unitPrice: string; // formatted like "1,250.00"
}

export interface OrderItem {
  id: string;
  slug?: string; // order_number from backend
  year: string; // created_at year
  month: string; // created_at month (MM)
  price: string; // formatted total
  status: string; // display label (derived from backend status)
  isActive?: boolean;
  items?: OrderProduct[];
}

export interface OrderApiProduct {
  id?: number | string;
  product?: {
    id?: number | string;
    name?: string;
  };
  name?: string;
  quantity?: number;
  price?: number | string | null;
  unit_price?: number | string | null;
}

export interface OrderApiResource {
  id?: number | string;
  order_number?: string;
  total?: number | string;
  total_amount?: number | string;
  created_at?: string;
  status?: string | { value?: string } | null;
  items?: OrderApiProduct[];
  shipping_address?: string | null;
  delivery_address?: string | null;
  payment_method?: string | null;
  payment_note?: string | null;
}

export interface OrderApiEnvelope {
  data?: OrderApiResource | OrderApiResource[] | null;
  order?: OrderApiResource | null;
  result?: OrderApiResource | null;
  message?: string;
}
