export const dashboardKeys = {
  stats: ['admin', 'dashboard', 'stats'] as const,
  latestOrders: (per_page = 5) => ['admin', 'dashboard', 'latest-orders', per_page] as const,
  featuredProducts: (per_page = 6) => ['admin', 'dashboard', 'featured-products', per_page] as const,
}

export const ordersKeys = {
  all: (params = {}) => ['admin', 'orders', params] as const,
  detail: (id: string | number) => ['admin', 'orders', 'detail', id] as const,
}

export const paymentsKeys = {
  list: (params = {}) => ['admin', 'payments', params] as const,
  detail: (id: string | number) => ['admin', 'payments', 'detail', id] as const,
}

export const customizationsKeys = {
  estimate: (params = {}) => ['admin', 'customizations', 'estimate', params] as const,
  create: ['admin', 'customizations', 'create'] as const,
  drafts: (params = {}) => ['admin', 'customizations', 'drafts', params] as const,
}

export const qualityKeys = {
  list: (params = {}) => ['admin', 'quality-reviews', params] as const,
  detail: (id: string | number) => ['admin', 'quality-reviews', 'detail', id] as const,
}

export const inventoryKeys = {
  materials: (params = {}) => ['admin', 'inventory', 'materials', params] as const,
  movements: (params = {}) => ['admin', 'inventory', 'movements', params] as const,
}
