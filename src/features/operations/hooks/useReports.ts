import { useQuery, useMutation, keepPreviousData } from '@tanstack/react-query'
import { reportsApi } from '../api/reportsApi'
import { reportsKeys } from './keys'

export function useReports(params: Record<string, any> = {}){
  return useQuery({
    queryKey: reportsKeys.list(params),
    queryFn: () => reportsApi.fetch(params),
    staleTime: 60 * 1000,
    placeholderData: keepPreviousData,
  })
}

export function useExportReport(){
  return useMutation({
    mutationFn: ({ params, type }: { params?: Record<string, any>; type: 'csv' | 'pdf' }) => {
      if (type === 'pdf') return reportsApi.exportPdf(params)
      return reportsApi.exportCsv(params)
    }
  })
}
