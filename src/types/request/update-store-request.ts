import { z } from "zod";
import { OperatingHour, OrderOption, PaymentMethod } from "../store-response";

export interface UpdateStoreRequest {
    name: string;
    description?: string;
    logo?: string;
    color: string;
    physicalAddress?: string;
    virtualAddress?: string;
    phone?: string;
    email?: string;
    website?: string;
    instagram?: string;
    facebook?: string;
    telegram?: string;
    operatingHours: OperatingHour[];
    orderOptions: OrderOption[];
    paymentMethods: PaymentMethod[];
    lat: number;
    lng: number;
    showGoogleMap: boolean;
}

export interface UpdateOperatingHour {
    id: string;
    day?: string;
    openTime?: string;
    closeTime?: string;
}

export interface UpdateOrderOption {
    id: string;
    name?: string;
    description?: string;
    feeRanges?: UpdateFeeRange[];
}

export interface UpdateFeeRange {
    id: string;
    condition?: string;
    fee?: number;
}

export interface UpdatePaymentMethod {
    id: string;
    method?: string;
}

export interface UpdateLanguage {
    id: string;
    language?: string;
}

export const updateStoreSchema = z.object({
    id: z.string().min(1, { message: "Store is required" }),
    name: z.string().min(4, { message: "Name is required and must be at least 4 characters" }),
    description: z.string().optional(),
    logo: z.string().optional(),
    color: z.string().min(1, { message: "Color is required" }),
    physicalAddress: z.string().optional(),
    virtualAddress: z.string().optional(),
    phone: z.string().min(10, { message: "Phone is required and must be at least 10 characters" }),
    email: z.string().optional(),
    website: z.string().optional(),
    instagram: z.string().optional(),
    facebook: z.string().optional(),
    telegram: z.string().optional(),
    operatingHours: z.array(z.object({
        id: z.string().optional(),
        day: z.string().optional(),
        openTime: z.string().optional(),
        closeTime: z.string().optional(),
    })).optional(),
    orderOptions: z.array(z.object({
        id: z.string().optional(),
        name: z.string().optional(),
        description: z.string().optional(),
        feeRanges: z.array(z.object({
            id: z.string().optional(),
            condition: z.string().optional(),
            fee: z.string().optional(),
        })).optional(),
    })).optional(),
    paymentMethods: z.array(z.object({
        id: z.string().optional(),
        method: z.string().optional(),
    })).optional(),
    languages: z.array(z.object({
        id: z.string().optional(),
    })).optional(),
    lat: z.number().optional(),
    lng: z.number().optional(),
    showGoogleMap: z.boolean().optional(),
});

export type UpdateStoreFormValues = z.infer<typeof updateStoreSchema>;