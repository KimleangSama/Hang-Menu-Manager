export interface StoreResponse {
    id: string
    slug: string
    name: string
    logo: string
    color: string
    description: string
    physicalAddress: string
    virtualAddress: string
    phone: string
    email: string
    website: string
    facebook: string
    instagram: string
    telegram: string
    createdAt: string
    createdBy: string
    hasPrivilege: boolean
    storeInfoResponse: StoreInfoResponse
}

export interface StoreInfoResponse {
    operatingHours: OperatingHour[]
    orderOptions: OrderOption[]
    paymentMethods: PaymentMethod[]
    languages: Language[]
}

export interface OperatingHour {
    id: string
    day: string
    openTime: string
    closeTime: string
}

export interface OrderOption {
    id: string
    name: string
    description: string
    feeRanges: FeeRange[]
}

export interface FeeRange {
    id: string
    condition: string
    fee: number
}

export interface PaymentMethod {
    id: string
    method: string
}

export interface Language {
    id: string
    language: string
}