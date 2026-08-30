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
  stageText: string;
  stageIndex: number;
  imageUrl?: string;
  referenceImageUrl?: string;
  artisanName?: string;
  artisanInitials?: string;
  artisanAvatar?: string;
  detailsStatusText?: string;
  requestCode?: string;
  customer?: { id?: string | number; name?: string; phone?: string; email?: string };
  productId?: string;
  productName?: string;
  quantity?: number;
  dimensions?: { length?: number | string | null; width?: number | string | null; height?: number | string | null };
  color?: string;
  designPattern?: string;
  price?: { base?: number | string | null; customization?: number | string | null; total?: number | string | null };
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
  customer_id?: number | string;
  product_id?: number | string;
  base_product_id?: number | string;
  color_id?: number | string;
  design_pattern_id?: number | string;
  quantity?: number | string;
  length_cm?: number | string;
  width_cm?: number | string;
  height_cm?: number | string;
  customer_notes?: string;
  reference_image_url?: string;
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
  reference_image_url?: string | null;
  created_at?: string | null;
}

const statusMap: Record<string, RequestStatus> = {
  pending_approval: "pending_review",
  in_production: "in_progress",
  completed: "completed",
};

const stageMap: Record<string, { text: string; index: number }> = {
  pending_review: { text: "قيد المراجعة", index: 1 },
  pending_approval: { text: "بانتظار الموافقة", index: 2 },
  in_progress: { text: "قيد التنفيذ", index: 3 },
  in_production: { text: "قيد التنفيذ", index: 3 },
  completed: { text: "تم التسليم", index: 4 },
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
  const rawStatus = String(item.status ?? "");
  const requestStatus = statusMap[rawStatus] ?? "pending_review";
  const stage = stageMap[rawStatus] ?? stageMap[requestStatus];
  const title = item.product?.name ?? item.request_code ?? `ط·ظ„ط¨ طھط®طµظٹطµ #${item.id}`;
  const description = item.customer_notes || item.product?.name || "ظ„ط§ طھظˆط¬ط¯ طھظپط§طµظٹظ„ ط¥ط¶ط§ظپظٹط©.";

  return {
    id: String(item.id),
    title,
    description,
    date: formatCustomRequestDate(item.created_at),
    status: requestStatus,
    statusText: stage.text,
    stageText: stage.text,
    stageIndex: stage.index,
    detailsStatusText: stage.text,
    requestCode: item.request_code ?? undefined,
    productId: item.product?.id == null ? undefined : String(item.product.id),
    productName: item.product?.name ?? undefined,
    customer: item.customer ?? undefined,
    quantity: item.quantity ?? undefined,
    dimensions: item.dimensions ?? undefined,
    color: item.color ?? undefined,
    designPattern: item.design_pattern ?? undefined,
    price: item.price ?? undefined,
    imageUrl: item.reference_image_url ?? undefined,
    referenceImageUrl: item.reference_image_url ?? undefined,
    artisanName: undefined,
    artisanInitials: undefined,
  };
}

function getAuthHeaders() {
  const token = customerAuthStorage.getToken();
  return token ? { Authorization: 'Bearer ' + token } : {};
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
      product: { id: 55, name: "ط®ط²ط§ظ†ط© ط³ظپط±ط© ط®ط´ط¨ظٹط©" },
      color: "ط¯ط±ط¯ط§ط±" ,
      design_pattern: "ظ…ط®ط·ط· ط¹ط±ط¨ظٹ" ,
      quantity: 1,
      dimensions: { length: 120, width: 60, height: 80 },
      price: { base: 1200, customization: 500, total: 1700 },
      status: "pending_approval",
      customer_notes: "ط£ط±ظٹط¯ ط®ط´ط¨ ظ…ط§ط¦ظ„ ظ…ط¹ ظ„ظ…ط³ط© ط¹ط±ط¨ظٹط© ط¯ط§ظپط¦ط© ظˆظ…ظ‚ط§ط³ ظ…ظ†ط§ط³ط¨ ظ„ط؛ط±ظپط© ط§ظ„ط·ط¹ط§ظ….",
      created_at: "2026-08-20T13:00:00Z",
    },
    {
      id: 1002,
      request_code: "CR-233-1002",
      product: { id: 66, name: "ظ…ظƒطھط¨ط© ظ…ط®طµطµط© ظ„ظ„ظ…ظ†ط·ظ‚ط©" },
      color: "ط§ظ„ظ„ظˆظ† ط§ظ„ط·ط¨ظٹط¹ظٹ" ,
      design_pattern: "طھظ‚ظ„ظٹط¯ظٹ" ,
      quantity: 2,
      dimensions: { length: 180, width: 35, height: 210 },
      price: { base: 2100, customization: 900, total: 3000 },
      status: "in_production",
      customer_notes: "ط£ط±ظٹط¯ ط±ظپظˆظپ ظپظٹ ط§ظ„ظ…ظ†طھطµظپ ظˆظˆط§ط¬ظ‡ط© ط®ط´ط¨ظٹط© ظ…ظ†ظ…ظ‚ط© ظ…ط¹ ط±ط³ظˆظ…ط§طھ ط¨ط³ظٹط·ط©.",
      created_at: "2026-08-18T09:30:00Z",
    },
    {
      id: 1003,
      request_code: "CR-233-1003",
      product: { id: 77, name: "ط·ط§ظˆظ„ط© ظ‚ظ‡ظˆط© ظ…ط®طµطµط©" },
      color: "ط§ظ„ط¨ظ„ظˆط· ط§ظ„ط¯ط§ظƒظ†" ,
      design_pattern: "ظ…ط¹ط§طµط±" ,
      quantity: 1,
      dimensions: { length: 90, width: 50, height: 45 },
      price: { base: 980, customization: 420, total: 1400 },
      status: "completed",
      customer_notes: "طھظ… طھط¬ظ‡ظٹط² ط§ظ„ط·ط§ظˆظ„ط© ظ…ط¹ ظ‚ط§ط¹ط¯ط© ظ…ط¹ط¯ظ†ظٹط© ط®ظپظٹظپط© ظˆظˆط§ط¬ظ‡ط© ط®ط´ط¨ظٹط© ظپط§ط®ط±ط©.",
      created_at: "2026-08-10T16:10:00Z",
    },
  ];

  localStorage.setItem(`mock_custom_requests_customer_${normalizedId}`, JSON.stringify(mockItems));
  return mockItems.map((item) => mapCustomizationToCustomRequest(item));
}

export const customRequestsApi = {
  getCustomRequests: async (): Promise<CustomRequestItem[]> => {
    const currentCustomerId = getCurrentCustomerId();

    // Keep the seeded demo customer consistent between the list and details views.
    if (currentCustomerId === "233") {
      const localMock = localStorage.getItem(`mock_custom_requests_customer_${currentCustomerId}`);
      const seeded = localMock
        ? (JSON.parse(localMock) as ProductCustomizationApiItem[])
        : seedMockCustomRequestsForCustomer(233);
      return seeded.map(mapCustomizationToCustomRequest);
    }

    const { data } = await customerApi.get("/customer/customizations", { headers: getAuthHeaders() });
    return unwrapRequestList(data).map(mapCustomizationToCustomRequest);
  },

  getCustomRequest: async (id: string | number): Promise<CustomRequestItem> => {
    const currentCustomerId = getCurrentCustomerId();

    // If using seeded mock data for customer 233, return from local mock storage
    if (currentCustomerId === "233") {
      const localMock = localStorage.getItem(`mock_custom_requests_customer_${currentCustomerId}`);
      const seeded = localMock ? (JSON.parse(localMock) as ProductCustomizationApiItem[]) : seedMockCustomRequestsForCustomer(233);
      const found = seeded.find((it) => String(it.id) === String(id) || String(it.request_code) === String(id));
      if (found) return mapCustomizationToCustomRequest(found);
    }

    const endpoints = [
      `/customer/customizations/${id}`,
      `/customer/custom-design-requests/${id}`,
      `/custom-design-requests/${id}`,
      `/customer/customizations`,
      `/customer/custom-design-requests`,
      `/custom-design-requests`,
    ];

    let lastError: unknown;

    for (const endpoint of endpoints) {
      try {
        const { data } = await customerApi.get(endpoint, { headers: getAuthHeaders() });

        // Single-item responses often come wrapped under data
        const candidate = (data?.data ?? data) as any;
        if (candidate && (String(candidate.id) === String(id) || String(candidate.request_code) === String(id))) {
          return mapCustomizationToCustomRequest(candidate as ProductCustomizationApiItem);
        }

        // Otherwise, try to find in a returned list
        const list = unwrapRequestList(data);
        if (Array.isArray(list) && list.length > 0) {
          const found = list.find((it) => String(it.id) === String(id) || String(it.request_code) === String(id));
          if (found) return mapCustomizationToCustomRequest(found);
        }
      } catch (error) {
        lastError = error;
      }
    }

    if (lastError) throw lastError;
    throw new Error("Custom request not found");
  },

  getProducts: async (): Promise<ProductOption[]> => {
    const { data } = await customerApi.get("/products", { headers: getAuthHeaders() });
    const items = unwrapRequestList(data);

    return items.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
    }));
  },

  createCustomRequest: async (input: CreateCustomRequestInput): Promise<CustomRequestItem> => {
    const customerId = Number(input.customer_id ?? useCustomerAuthStore.getState().user?.id ?? 0);
    const productId = Number(input.product_id ?? input.base_product_id ?? 0);
    const notes = input.customer_notes || input.description || input.title || "";

    const payload: Record<string, unknown> = {
      ...(customerId > 0 ? { customer_id: customerId } : {}),
      ...(productId > 0 ? { product_id: productId, base_product_id: productId } : {}),
      quantity: Number(input.quantity ?? 1),
      ...(input.color_id ? { color_id: Number(input.color_id) } : {}),
      ...(input.design_pattern_id ? { design_pattern_id: Number(input.design_pattern_id) } : {}),
      ...(input.length_cm === undefined || input.length_cm === "" ? {} : { length_cm: Number(input.length_cm) }),
      ...(input.width_cm === undefined || input.width_cm === "" ? {} : { width_cm: Number(input.width_cm) }),
      ...(input.height_cm === undefined || input.height_cm === "" ? {} : { height_cm: Number(input.height_cm) }),
      customer_notes: notes,
    };

    const endpoints = ["/customer/customizations", "/customer/custom-design-requests"];
    let lastError: unknown;

    for (const endpoint of endpoints) {
      try {
        console.debug("[customRequestsApi] createCustomRequest payload:", { endpoint, payload });
        const headers = getAuthHeaders();
        console.debug("[customRequestsApi] request headers:", headers);

        const response = await customerApi.post(endpoint, payload, { headers });
        console.debug("[customRequestsApi] response:", response);

        const item = (response.data?.data ?? response.data) as ProductCustomizationApiItem;
        console.debug("[customRequestsApi] mapped item:", item);
        return mapCustomizationToCustomRequest(item);
      } catch (error) {
        lastError = error;
        console.error(`[customRequestsApi] Failed createCustomRequest at ${endpoint}:`, error);
      }
    }

    throw lastError ?? new Error("Failed to create custom request");
  },
};

