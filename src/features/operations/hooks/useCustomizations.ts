import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { customizationsApi } from '../api/customizationsApi'

// 1. الدالة الأساسية التي تطلبها صفحة CustomizationsPage
export function useCustomizations(params: Record<string, any> = {}) {
  return useQuery({
    queryKey: ['customizations', params],
    queryFn: () => customizationsApi.list(params),
    staleTime: 60 * 1000,
  })
}

// 2. دالة حساب التكلفة التقديرية
export function useEstimateCustomization() {
  return useMutation({
    mutationFn: (payload: Record<string, any>) => customizationsApi.estimate(payload),
  })
}

// 3. دالة إنشاء تخصيص جديد
export function useCreateCustomization() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: FormData) => customizationsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customizations'] })
    },
  })
}

// 4. دالة حفظ المسودة
export function useSaveDraft(id: number | null) {
  return useMutation({
    mutationFn: (payload: Record<string, any>) => customizationsApi.saveDraft(id, payload),
  })
}