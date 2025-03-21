import { BaseResponse } from "../types/base-response";
import { UpdateStoreFormValues, UpdateStoreRequest } from "../types/request/update-store-request";
import { StoreResponse } from "../types/store-response";
import { uuidv4 } from "./utils";

/* eslint-disable  @typescript-eslint/no-explicit-any */
export const parseStoreInfoResponse = (form: any, response: BaseResponse<StoreResponse>) => {
    const sanitizedData = {
        id: response.payload.id || "",
        name: response.payload.name || "",
        slug: response.payload.slug || "",
        description: response.payload.description || "",
        logo: response.payload.logo || "",
        physicalAddress: response.payload.physicalAddress || "",
        virtualAddress: response.payload.virtualAddress || "",
        phone: response.payload.phone || "",
        email: response.payload.email || "",
        website: response.payload.website || "",
        facebook: response.payload.facebook || "",
        instagram: response.payload.instagram || "",
        telegram: response.payload.telegram || "",
        operatingHours: (response.payload.storeInfoResponse.operatingHours || []).map(hour => ({
            id: hour.id || "",
            day: hour.day || "",
            openTime: hour.openTime || "",
            closeTime: hour.closeTime || ""
        })),
        orderOptions: (response.payload.storeInfoResponse.orderOptions || []).map(option => ({
            id: option.id || "",
            name: option.name || "",
            description: option.description || "",
            feeRanges: (option.feeRanges || []).map(range => ({
                id: range.id || "",
                condition: range.condition || "",
                fee: range.fee || "0"
            }))
        })),
        paymentMethods: (response.payload.storeInfoResponse.paymentMethods || []).map(method => ({
            id: method.id || "",
            method: method.method || ""
        })),
        color: response.payload.color || "",
        lat: response.payload.lat || 0,
        lng: response.payload.lng || 0,
        showGoogleMap: response.payload.showGoogleMap || true,
    };
    form.reset(sanitizedData);
}

export const mapUpdateStoreFormValues = (data: UpdateStoreFormValues): UpdateStoreRequest => {
    return {
        name: data.name,
        slug: data.slug,
        logo: data.logo,
        color: data.color || "#4287f5",
        description: data.description,
        physicalAddress: data.physicalAddress,
        virtualAddress: data.virtualAddress,
        phone: data.phone,
        email: data.email,
        website: data.website,
        facebook: data.facebook,
        instagram: data.instagram,
        telegram: data.telegram,
        operatingHours: (data.operatingHours ?? []).map(hour => ({
            id: hour.id || uuidv4(),
            day: hour.day || "",
            openTime: hour.openTime || "",
            closeTime: hour.closeTime || "",
        })),
        orderOptions: (data.orderOptions ?? []).map(option => ({
            id: option.id || uuidv4(),
            name: option.name || "",
            description: option.description || "",
            feeRanges: (option.feeRanges ?? []).map(feeRange => ({
                id: feeRange.id || uuidv4(),
                condition: feeRange.condition || "",
                fee: String(feeRange.fee || "0"),
            })),
        })),
        paymentMethods: (data.paymentMethods ?? []).map(method => ({
            id: method.id || uuidv4(),
            method: method.method || "",
        })),
        lat: data.lat || 0,
        lng: data.lng || 0,
        showGoogleMap: data.showGoogleMap || true,
    };
}