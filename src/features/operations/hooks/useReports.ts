import { useQuery, useMutation, keepPreviousData } from '@tanstack/react-query'
import { reportsApi } from '../api/reportsApi'
import { dashboardApi } from '../api/dashboardApi'
import { reportsKeys } from './keys'

export function useReports(params: { from?: string; to?: string;[key: string]: any } = {}) {
  return useQuery({
    queryKey: reportsKeys.list(params),
    queryFn: () => dashboardApi.getStats({ from: params.from, to: params.to }),
    staleTime: 60 * 1000,
    placeholderData: keepPreviousData,
  })
}

export function useExportReport() {
  return useMutation({
    mutationFn: ({ params, type }: { params?: Record<string, any>; type: 'csv' | 'pdf' }) => {
      if (type === 'pdf') return reportsApi.exportPdf(params)
      return reportsApi.exportCsv(params)
    }
  })
}
