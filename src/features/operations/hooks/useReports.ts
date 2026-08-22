import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { dashboardApi } from '../api/dashboardApi'
import { reportsKeys } from './keys'
export function useReports(params: { from?: string; to?: string } = {}) { return useQuery({ queryKey: reportsKeys.list(params), queryFn: () => dashboardApi.getStats(params), staleTime: 60_000, placeholderData: keepPreviousData }) }
