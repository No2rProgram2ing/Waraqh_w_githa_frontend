import { customerApi } from "@/api/customerApi";
import { customerAuthStorage } from "@/features/auth-customer/services/customerAuthStorage";
import { useCustomerAuthStore } from "@/features/auth-customer/stores/customerAuthStore";

export type RequestStatus = "completed" | "in_progress" | "pending_review";

export interface CustomRequestItem {
  id: string;
  title: string;
  description: string;
  date: string;
  status: RequestStatus;
  statusText: string;
  imageUrl?: string;
  artisanName?: string;
  artisanInitials?: string;
  artisanAvatar?: string;
  detailsStatusText?: string;
}

export interface ProductOption {
  id: number | string;
  name: string;
  description?: string | null;
  price?: number | string | null;
}

export interface CreateCustomRequestInput {
  title?: string;
  description?: string;
  woodType?: string;
  dimensions?: string;
  budget?: string;
  base_product_id?: number | string;
  quantity?: number | string;
  length_cm?: number | string;
  width_cm?: number | string;
  height_cm?: number | string;
  customer_notes?: string;
}

interface ProductCustomizationApiItem {
  id: number | string;
  request_code?: string | null;
  product?: {
    id?: number | string | null;
    name?: string | null;
  } | null;
  color?: string | null;
  design_pattern?: string | null;
  quantity?: number | null;
  dimensions?: {
    length?: number | string | null;
    width?: number | string | null;
    height?: number | string | null;
  } | null;
  price?: {
    base?: number | string | null;
    customization?: number | string | null;
    total?: number | string | null;
  } | null;
  status?: string | null;
  customer_notes?: string | null;
  created_at?: string | null;
}

const statusMap: Record<string, RequestStatus> = {
  pending_approval: "pending_review",
  in_production: "in_progress",
  completed: "completed",
};

const statusTextMap: Record<RequestStatus, string> = {
  completed: "مكتمل",
  in_progress: "قيد التنفيذ",
  pending_review: "بانتظار المراجعة",
};

function formatCustomRequestDate(value?: string | null): string {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("ar-EG", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

function unwrapRequestList(payload: unknown): ProductCustomizationApiItem[] {
  if (Array.isArray(payload)) return payload as ProductCustomizationApiItem[];
  if (!payload || typeof payload !== "object") return [];

  const candidate = payload as Record<string, unknown>;

  const nestedCandidates = [
    candidate.data,
    candidate.requests,
    candidate.result,
    candidate.custom_requests,
    candidate.customDesignRequests,
    candidate.custom_design_requests,
    candidate.items,
  ];

  for (const value of nestedCandidates) {
    if (Array.isArray(value)) return value as ProductCustomizationApiItem[];
  }

  return [];
}

function mapCustomizationToCustomRequest(item: ProductCustomizationApiItem): CustomRequestItem {
  const requestStatus = statusMap[String(item.status ?? "")] ?? "pending_review";
  const title = item.product?.name ?? item.request_code ?? `طلب تخصيص #${item.id}`;
  const description = item.customer_notes || item.product?.name || "لا توجد تفاصيل إضافية.";

  return {
    id: String(item.id),
    title,
    description,
    date: formatCustomRequestDate(item.created_at),
    status: requestStatus,
    statusText: statusTextMap[requestStatus],
    detailsStatusText: statusTextMap[requestStatus],
    imageUrl: undefined,
    artisanName: undefined,
    artisanInitials: undefined,
  };
}

function getAuthHeaders() {
  const token = customerAuthStorage.getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function getCurrentCustomerId(): string {
  const userId = useCustomerAuthStore.getState().user?.id ?? localStorage.getItem("mock_customer_id");
  return String(userId ?? "");
}

export function seedMockCustomRequestsForCustomer(customerId: string | number = 233): CustomRequestItem[] {
  const normalizedId = String(customerId);
  const mockItems: ProductCustomizationApiItem[] = [
    {
      id: 1001,
      request_code: "CR-233-1001",
      product: { id: 55, name: "خزانة سفرة خشبية" },
      color: "دردار" ,
      design_pattern: "مخطط عربي" ,
      quantity: 1,
      dimensions: { length: 120, width: 60, height: 80 },
      price: { base: 1200, customization: 500, total: 1700 },
      status: "pending_approval",
      customer_notes: "أريد خشب مائل مع لمسة عربية دافئة ومقاس مناسب لغرفة الطعام.",
      created_at: "2026-08-20T13:00:00Z",
    },
    {
      id: 1002,
      request_code: "CR-233-1002",
      product: { id: 66, name: "مكتبة مخصصة للمنطقة" },
      color: "اللون الطبيعي" ,
      design_pattern: "تقليدي" ,
      quantity: 2,
      dimensions: { length: 180, width: 35, height: 210 },
      price: { base: 2100, customization: 900, total: 3000 },
      status: "in_production",
      customer_notes: "أريد رفوف في المنتصف وواجهة خشبية منمقة مع رسومات بسيطة.",
      created_at: "2026-08-18T09:30:00Z",
    },
    {
      id: 1003,
      request_code: "CR-233-1003",
      product: { id: 77, name: "طاولة قهوة مخصصة" },
      color: "البلوط الداكن" ,
      design_pattern: "معاصر" ,
      quantity: 1,
      dimensions: { length: 90, width: 50, height: 45 },
      price: { base: 980, customization: 420, total: 1400 },
      status: "completed",
      customer_notes: "تم تجهيز الطاولة مع قاعدة معدنية خفيفة وواجهة خشبية فاخرة.",
      created_at: "2026-08-10T16:10:00Z",
    },
  ];

  localStorage.setItem(`mock_custom_requests_customer_${normalizedId}`, JSON.stringify(mockItems));
  return mockItems.map((item) => mapCustomizationToCustomRequest(item));
}

export const customRequestsApi = {
  getCustomRequests: async (): Promise<CustomRequestItem[]> => {
    const currentCustomerId = getCurrentCustomerId();
    const localMock = localStorage.getItem(`mock_custom_requests_customer_${currentCustomerId}`);

    if (currentCustomerId === "233") {
      const seeded = localMock ? JSON.parse(localMock) as ProductCustomizationApiItem[] : seedMockCustomRequestsForCustomer(233);
      return seeded.map((item: ProductCustomizationApiItem) => mapCustomizationToCustomRequest(item));
    }

    const endpoints = [
      "/customer/customizations",
      "/customer/custom-design-requests",
      "/custom-design-requests",
    ];

    let lastError: unknown;

    for (const endpoint of endpoints) {
      try {
        const { data } = await customerApi.get(endpoint, { headers: getAuthHeaders() });
        const items = unwrapRequestList(data);

        if (items.length > 0 || (data && typeof data === "object" && Object.keys(data as Record<string, unknown>).length > 0)) {
          return items.map((item: ProductCustomizationApiItem) => mapCustomizationToCustomRequest(item));
        }
      } catch (error) {
        lastError = error;
      }
    }

    if (lastError) {
      throw lastError;
    }

    return [];
  },

  getProducts: async (): Promise<ProductOption[]> => {
    const { data } = await customerApi.get("/products", { headers: getAuthHeaders() });
    const items = unwrapRequestList(data) as any[];

    return items.map((item: any) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
    }));
  },

  createCustomRequest: async (input: CreateCustomRequestInput): Promise<CustomRequestItem> => {
    const payload = {
      base_product_id: Number(input.base_product_id ?? 0),
      quantity: Number(input.quantity ?? 1),
      length_cm: input.length_cm === undefined || input.length_cm === "" ? null : Number(input.length_cm),
      width_cm: input.width_cm === undefined || input.width_cm === "" ? null : Number(input.width_cm),
      height_cm: input.height_cm === undefined || input.height_cm === "" ? null : Number(input.height_cm),
      customer_notes: input.customer_notes || input.description || input.title || "",
    };

    const endpoints = [
      "/customer/customizations",
      "/customer/custom-design-requests",
      "/custom-design-requests",
    ];

    let lastError: unknown;

    for (const endpoint of endpoints) {
      try {
        const { data } = await customerApi.post(endpoint, payload, { headers: getAuthHeaders() });
        const item = (Array.isArray(data) ? data[0] : data?.data ?? data) as ProductCustomizationApiItem | undefined;
        if (item) return mapCustomizationToCustomRequest(item);
      } catch (error) {
        lastError = error;
      }
    }

    if (lastError) {
      throw lastError;
    }

    throw new Error("تعذر إرسال طلب التصميم الخاص.");
  },
};
