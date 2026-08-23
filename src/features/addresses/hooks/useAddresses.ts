import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { addressesApi, extractValidationErrors } from "@/api/addresses";
import type { AddressItem, AddressPayload } from "@/features/addresses/types";
import { showErrorToast, showSuccessToast, showValidationErrorToast } from "@/lib/toast";

export const addressKeys = {
  all: ["addresses"] as const,
  detail: (id: number | string) => [...addressKeys.all, "detail", id] as const,
};

export function useAddresses() {
  return useQuery({
    queryKey: addressKeys.all,
    queryFn: addressesApi.getAll,
    staleTime: 60_000,
  });
}

export function useCreateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddressPayload) => addressesApi.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: addressKeys.all });
      showSuccessToast("تمت إضافة العنوان بنجاح");
    },
    onError: (error: unknown) => {
      const validationErrors = extractValidationErrors(error);
      if (validationErrors) {
        showValidationErrorToast(validationErrors);
        return;
      }

      const message = axios.isAxiosError(error)
        ? (error.response?.data?.message as string | undefined) ?? "فشل في إضافة العنوان، يرجى المحاولة مرة أخرى."
        : "فشل في إضافة العنوان، يرجى المحاولة مرة أخرى.";
      showErrorToast(message);
    },
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: Partial<AddressPayload> }) => addressesApi.update(id, data),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: addressKeys.all });
      await queryClient.invalidateQueries({ queryKey: addressKeys.detail(variables.id) });
      showSuccessToast("تم تحديث العنوان بنجاح");
    },
    onError: (error: unknown) => {
      const validationErrors = extractValidationErrors(error);
      if (validationErrors) {
        showValidationErrorToast(validationErrors);
        return;
      }

      const message = axios.isAxiosError(error)
        ? (error.response?.data?.message as string | undefined) ?? "فشل في تحديث العنوان، يرجى المحاولة مرة أخرى."
        : "فشل في تحديث العنوان، يرجى المحاولة مرة أخرى.";
      showErrorToast(message);
    },
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => addressesApi.delete(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: addressKeys.all });
      showSuccessToast("تم حذف العنوان بنجاح");
    },
    onError: (error: unknown) => {
      const validationErrors = extractValidationErrors(error);
      if (validationErrors) {
        showValidationErrorToast(validationErrors);
        return;
      }

      const message = axios.isAxiosError(error)
        ? (error.response?.data?.message as string | undefined) ?? "فشل في حذف العنوان، يرجى المحاولة مرة أخرى."
        : "فشل في حذف العنوان، يرجى المحاولة مرة أخرى.";
      showErrorToast(message);
    },
  });
}

export function useSetDefaultAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => addressesApi.setDefault(id),
    onSuccess: async (_, id) => {
      await queryClient.invalidateQueries({ queryKey: addressKeys.all });
      await queryClient.invalidateQueries({ queryKey: addressKeys.detail(id) });
      showSuccessToast("تم تعيين العنوان الافتراضي بنجاح");
    },
    onError: (error: unknown) => {
      const validationErrors = extractValidationErrors(error);
      if (validationErrors) {
        showValidationErrorToast(validationErrors);
        return;
      }

      const message = axios.isAxiosError(error)
        ? (error.response?.data?.message as string | undefined) ?? "فشل في تعيين العنوان الافتراضي، يرجى المحاولة مرة أخرى."
        : "فشل في تعيين العنوان الافتراضي، يرجى المحاولة مرة أخرى.";
      showErrorToast(message);
    },
  });
}

export type AddressListQuery = ReturnType<typeof useAddresses>;
export type AddressMutationResult = AddressItem;
