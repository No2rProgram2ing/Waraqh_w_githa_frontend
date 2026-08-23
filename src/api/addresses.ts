import axios from "axios";
import { customerApi } from "@/api/customerApi";
import type {
  AddressItem,
  AddressPayload,
  AddressListResponseShape,
  AddressResponseShape,
} from "@/features/addresses/types";

const unwrapData = <T>(response: T | { data: T }): T => {
  if (response && typeof response === "object" && "data" in response && !Array.isArray(response)) {
    return (response as { data: T }).data;
  }

  return response as T;
};

const normalizeAddress = (address: AddressItem): AddressItem => ({
  ...address,
  id: address.id ?? 0,
  customer_id: address.customer_id ?? null,
  recipient_name: address.recipient_name ?? "",
  phone: address.phone ?? "",
  country: address.country ?? "",
  city: address.city ?? "",
  district: address.district ?? "",
  street: address.street ?? "",
  postal_code: address.postal_code ?? "",
  is_default: Boolean(address.is_default),
});

const ADDRESS_ENDPOINT = "/customer/addresses";

export const addressesApi = {
  getAll: async (): Promise<AddressItem[]> => {
    const response = await customerApi.get<AddressListResponseShape | AddressItem[]>(ADDRESS_ENDPOINT);
    const payload = unwrapData(response.data);

    if (Array.isArray(payload)) {
      return payload.map(normalizeAddress);
    }

    if (payload && typeof payload === "object" && "data" in payload && Array.isArray((payload as { data: unknown }).data)) {
      return ((payload as { data: AddressItem[] }).data ?? []).map(normalizeAddress);
    }

    return [];
  },

  create: async (payload: AddressPayload): Promise<AddressItem> => {
    const response = await customerApi.post<AddressResponseShape | AddressItem>(ADDRESS_ENDPOINT, payload);
    return normalizeAddress(unwrapData(response.data));
  },

  update: async (id: number | string, payload: Partial<AddressPayload>): Promise<AddressItem> => {
    const response = await customerApi.patch<AddressResponseShape | AddressItem>(`${ADDRESS_ENDPOINT}/${id}`, payload);
    return normalizeAddress(unwrapData(response.data));
  },

  delete: async (id: number | string): Promise<void> => {
    await customerApi.delete(`${ADDRESS_ENDPOINT}/${id}`);
  },

  setDefault: async (id: number | string): Promise<AddressItem> => {
    const response = await customerApi.patch<AddressResponseShape | AddressItem>(`${ADDRESS_ENDPOINT}/${id}/default`);
    return normalizeAddress(unwrapData(response.data));
  },
};

export const extractValidationErrors = (error: unknown): Record<string, string[]> | undefined => {
  if (!axios.isAxiosError(error)) {
    return undefined;
  }

  const validationErrors = error.response?.data?.errors as Record<string, string[]> | undefined;
  if (!validationErrors || typeof validationErrors !== "object") {
    return undefined;
  }

  return validationErrors;
};
