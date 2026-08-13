export interface SystemSettings {
    // General
    store_name: string
    store_logo: string | null
    contact_email: string
    contact_phone: string | null
    
    // Finance
    tax_rate: number // e.g. 15 for 15%
    default_currency: string // e.g. "SAR"

    // Maintenance
    maintenance_mode: boolean
    maintenance_message: string | null
}

export interface UpdateSettingsPayload extends Partial<SystemSettings> {
    tax_enabled?: boolean
}
