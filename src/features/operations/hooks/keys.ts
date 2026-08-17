export const dashboardKeys = {
  stats: ['admin', 'dashboard', 'stats'] as const,
  latestOrders: (per_page = 5) => ['admin', 'dashboard', 'latest-orders', per_page] as const,
  featuredProducts: (per_page = 6) => ['admin', 'dashboard', 'featured-products', per_page] as const,
}

export const ordersKeys = {
  all: (params = {}) => ['admin', 'orders', params] as const,
}

export const paymentsKeys = {
  list: (params = {}) => ['admin', 'payments', params] as const,
  detail: (id: string | number) => ['admin', 'payments', 'detail', id] as const,
}
