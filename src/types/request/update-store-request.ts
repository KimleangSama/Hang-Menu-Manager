import { FeeRange, OperatingHour, OrderOption, PaymentMethod } from "../store-response";

export interface UpdateStoreRequest {
    name: string;
    description: string;
    logo: string;
    color: string;
    physicalAddress: string;
    virtualAddress: string;
    phone: string;
    email: string;
    website: string;
    instagram: string;
    facebook: string;
    telegram: string;
    operatingHours: OperatingHour[];
    orderOptions: OrderOption[];
    paymentMethods: PaymentMethod[];
}

export interface UpdateOperatingHour {
    id: string;
    day: string;
    openTime: string;
    closeTime: string;
}

export interface UpdateOrderOption {
    id: string;
    name: string;
    description: string;
    feeRanges: UpdateFeeRange[];
}

export interface UpdateFeeRange {
    id: string;
    condition: string;
    fee: number;
}

export interface UpdatePaymentMethod {
    id: string;
    method: string;
}

export interface UpdateLanguage {
    id: string;
    language: string;
}

export type UpdateStoreFormValues = {
    id: string;
    name: string;
    description: string;
    logo: string;
    color: string;
    physicalAddress: string;
    virtualAddress: string;
    phone: string;
    email: string;
    website: string;
    instagram: string;
    facebook: string;
    telegram: string;
    operatingHours: OperatingHour[];
    orderOptions: OrderOption[];
    feeRanges: FeeRange[];
    paymentMethods: PaymentMethod[];
    languages: UpdateLanguage[];
};
