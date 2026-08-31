import { useQuery } from '@tanstack/react-query';
import { customerApi } from '@/api/customerApi';

export interface CurrencyConfig {
    primary_currency: string;
    secondary_currency: string;
    exchange_rate: number;
}

export function useCurrencyConfig() {
    return useQuery({
        queryKey: ['currency-config'],
        queryFn: async (): Promise<CurrencyConfig> => {
            const resp = await customerApi.get<CurrencyConfig>('/settings');
            return resp.data;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: true,
        refetchInterval: 1000 * 15, // Auto-poll every 15 seconds
    });
}
