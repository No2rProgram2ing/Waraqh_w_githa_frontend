export interface AddressItem {
 id: number | string;
 customer_id?: number | null;
 recipient_name?: string | null;
 phone?: string | null;
 country?: string | null;
 city?: string | null;
 district?: string | null;
 street?: string | null;
 postal_code?: string | null;
 is_default?: boolean;
 latitude?: number | null;
 longitude?: number | null;
 created_at?: string;
 updated_at?: string;
}

export interface AddressPayload {
 customer_id?: number | null;
 recipient_name: string;
 phone?: string | null;
 country: string;
 city: string;
 district?: string | null;
 street: string;
 postal_code?: string | null;
 is_default?: boolean;
 latitude?: number | null;
 longitude?: number | null;
}

export interface AddressListResponse {
 status?: boolean;
 message?: string;
 data: AddressItem[];
}

export interface AddressResponse {
 status?: boolean;
 message?: string;
 data: AddressItem;
}

export type CreateAddressPayload = AddressPayload;
export type UpdateAddressPayload = Partial<AddressPayload>;

export type AddressListResponseShape = AddressItem[] | AddressListResponse;
export type AddressResponseShape = AddressItem | AddressResponse;

export interface AddressFormValues {
 customer_id?: number | null;
 recipient_name: string;
 phone: string;
 country: string;
 city: string;
 district: string;
 street: string;
 postal_code: string;
 is_default: boolean;
 latitude: number | null;
 longitude: number | null;
}
