import axios from "axios";
import { customerApi } from "@/api/customerApi";
import type {
  AddressItem,
  AddressPayload,
  AddressListResponse,
  AddressResponse,
} from "@/features/addresses/types";

export type AddressMutationInput = AddressPayload;

const unwrapResponseData = <T>(response: T | { data: T }): T => {
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

export const addressService = {
  async getAll(): Promise<AddressItem[]> {
    const response = await customerApi.get<AddressListResponse | AddressItem[]>(ADDRESS_ENDPOINT);
    const payload = unwrapResponseData(response.data);

    if (Array.isArray(payload)) {
      return payload.map(normalizeAddress);
    }

    if (payload && typeof payload === "object" && "data" in payload && Array.isArray((payload as { data: unknown }).data)) {
      return ((payload as { data: AddressItem[] }).data ?? []).map(normalizeAddress);
    }

    return [];
  },

  async create(payload: AddressPayload): Promise<AddressItem> {
    const response = await customerApi.post<AddressResponse | AddressItem>(ADDRESS_ENDPOINT, payload);
    return normalizeAddress(unwrapResponseData(response.data));
  },

  async update(id: number | string, payload: Partial<AddressPayload>): Promise<AddressItem> {
    const response = await customerApi.patch<AddressResponse | AddressItem>(`${ADDRESS_ENDPOINT}/${id}`, payload);
    return normalizeAddress(unwrapResponseData(response.data));
  },

  async remove(id: number | string): Promise<void> {
    await customerApi.delete(`${ADDRESS_ENDPOINT}/${id}`);
  },

  async setDefault(id: number | string): Promise<AddressItem> {
    const response = await customerApi.patch<AddressResponse | AddressItem>(`${ADDRESS_ENDPOINT}/${id}/default`);
    return normalizeAddress(unwrapResponseData(response.data));
  },
};

export const extractValidationErrors = (error: unknown): Record<string, string[]> | undefined => {
  if (!axios.isAxiosError(error)) {
    return undefined;
  }

  const errors = error.response?.data?.errors as Record<string, string[]> | undefined;
  if (!errors || typeof errors !== "object") {
    return undefined;
  }

  return errors;
};

export default addressService;
