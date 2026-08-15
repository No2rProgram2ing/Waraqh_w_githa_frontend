export type AddressType = "home" | "work" | "other";

export interface AddressItem {
  id: string;
  title: string;
  type: AddressType;
  isPrimary?: boolean;
  address: string;
  city: string;
  phone: string;
  note?: string;
}
