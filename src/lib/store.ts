import { UpdateStoreFormValues, UpdateStoreRequest } from "../types/request/update-store-request";
import { StoreResponse } from "../types/store-response";
import { uuidv4 } from "./utils";

/* eslint-disable  @typescript-eslint/no-explicit-any */
export const parseStoreInfoResponse = (form: any, response: StoreResponse | null) => {
    if (!response) {
        return;
    }
    const formData = {
        id: response.id || "",
        name: response.name || "",
        slug: response.slug || "",
        description: response.description || "",
        logo: response.logo || "",
        physicalAddress: response.physicalAddress || "",
        virtualAddress: response.virtualAddress || "",
        phone: response.phone || "",
        email: response.email || "",
        website: response.website || "",
        facebook: response.facebook || "",
        instagram: response.instagram || "",
        telegram: response.telegram || "",
        operatingHours: (response.storeInfoResponse.operatingHours || []).map(hour => ({
            id: hour.id || "",
            day: hour.day || "",
            openTime: hour.openTime || "",
            closeTime: hour.closeTime || ""
        })),
        orderOptions: (response.storeInfoResponse.orderOptions || []).map(option => ({
            id: option.id || "",
            name: option.name || "",
            description: option.description || "",
            feeRanges: (option.feeRanges || []).map(range => ({
                id: range.id || "",
                condition: range.condition || "",
                fee: range.fee || "0"
            }))
        })),
        paymentMethods: (response.storeInfoResponse.paymentMethods || []).map(method => ({
            id: method.id || "",
            method: method.method || ""
        })),
        color: response.color || "",
        lat: response.lat || 0,
        lng: response.lng || 0,
        showGoogleMap: response.showGoogleMap || true,
    };
    form.reset(formData);
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