import { useCallback, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'

import { axiosAdminClient } from '@/api/axiosAdminClient'
import { useSettings } from '@/features/settings/hooks/useSettings'

export interface ExchangeRateResponse {
  data: {
    base_currency: string
    rates: Record<string, number>
    last_updated_at: string | null
    is_stale: boolean
  }
}

export const currencyOptions = [
  { code: 'YER', label: 'ريال يمني (YER)' },
  { code: 'USD', label: 'دولار أمريكي (USD)' },
  { code: 'SAR', label: 'ريال سعودي (SAR)' },
  { code: 'AED', label: 'درهم إماراتي (AED)' },
  { code: 'EGP', label: 'جنيه مصري (EGP)' },
  { code: 'JOD', label: 'دينار أردني (JOD)' },
  { code: 'KWD', label: 'دينار كويتي (KWD)' },
  { code: 'QAR', label: 'ريال قطري (QAR)' },
] as const

export type CurrencyCode = (typeof currencyOptions)[number]['code']

export function normalizeCurrencyCode(value?: string | null): CurrencyCode {
  const normalized = (value ?? 'YER').trim().toUpperCase()

  return currencyOptions.some((currency) => currency.code === normalized)
    ? (normalized as CurrencyCode)
    : 'YER'
}

export function getCurrencyLocale(currencyCode: string): string {
  switch (normalizeCurrencyCode(currencyCode)) {
    case 'YER':
      return 'ar-YE'
    case 'USD':
      return 'en-US'
    case 'SAR':
      return 'ar-SA'
    default:
      return 'ar-SA'
  }
}

export function getCurrencyLabel(currencyCode: string): string {
  const normalized = normalizeCurrencyCode(currencyCode)
  return currencyOptions.find((currency) => currency.code === normalized)?.label ?? 'ريال يمني (YER)'
}

export function convertYERToCurrency(
  amount: number | string | null | undefined,
  targetCurrency: string,
  rates?: Record<string, number>,
): number {
  const numericAmount = Number(amount ?? 0)
  const normalizedTargetCurrency = normalizeCurrencyCode(targetCurrency)

  if (normalizedTargetCurrency === 'YER' || !Number.isFinite(numericAmount)) {
    return numericAmount
  }

  const availableRates = rates ?? {}
  const yemenRate = Number(availableRates.YER)
  const targetRate = Number(availableRates[normalizedTargetCurrency])

  if (!Number.isFinite(yemenRate) || !Number.isFinite(targetRate) || yemenRate === 0) {
    return numericAmount
  }

  return numericAmount * (targetRate / yemenRate)
}

export function formatCurrency(
  amount: number | string | null | undefined,
  currencyCodeOverride?: string | null,
  options: Intl.NumberFormatOptions = {},
): string {
  const numericAmount = Number(amount ?? 0)
  const currencyCode = normalizeCurrencyCode(currencyCodeOverride ?? 'YER')
  const locale = getCurrencyLocale(currencyCode)

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: currencyCode === 'YER' ? 0 : 2,
    maximumFractionDigits: currencyCode === 'YER' ? 0 : 2,
    ...options,
  }).format(Number.isFinite(numericAmount) ? numericAmount : 0)
}

export const exchangeRateKeys = {
  all: ['exchange-rates'] as const,
}

export function useExchangeRates() {
  return useQuery({
    queryKey: exchangeRateKeys.all,
    queryFn: async () => {
      const response = await axiosAdminClient.get<ExchangeRateResponse>('/admin/exchange-rates')
      return response.data.data
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
  })
}

export function useSystemCurrency() {
  const { data: settings } = useSettings()
  const { data: exchangeRates } = useExchangeRates()

  const currencyCode = useMemo(
    () => normalizeCurrencyCode(settings?.default_currency ?? settings?.currency ?? 'YER'),
    [settings?.currency, settings?.default_currency],
  )

  const formatAmount = useCallback(
    (amount: number | string | null | undefined, extraOptions: Intl.NumberFormatOptions = {}) => {
      const normalizedAmount =
        currencyCode === 'YER'
          ? Number(amount ?? 0)
          : convertYERToCurrency(amount, currencyCode, exchangeRates?.rates)

      return formatCurrency(normalizedAmount, currencyCode, extraOptions)
    },
    [currencyCode, exchangeRates?.rates],
  )

  return {
    currencyCode,
    currencyLabel: getCurrencyLabel(currencyCode),
    formatAmount,
  }
}
