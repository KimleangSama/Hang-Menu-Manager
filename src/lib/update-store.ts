import { BaseResponse } from "../types/base-response";
import { UpdateStoreFormValues } from "../types/request/update-store-request";
import { StoreResponse } from "../types/store-response";
import { uuidv4 } from "./utils";

/* eslint-disable  @typescript-eslint/no-explicit-any */
export const parseStoreInfoResponse = (form: any, response: BaseResponse<StoreResponse>) => {
    const sanitizedData = {
        id: response.payload.id || "",
        name: response.payload.name || "",
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
                fee: range.fee || 0
            }))
        })),
        feeRanges: (response.payload.storeInfoResponse.orderOptions || []).flatMap(option =>
            (option.feeRanges || []).map(range => ({
                id: range.id || "",
                condition: range.condition || "",
                fee: range.fee || 0
            }))
        ),
        paymentMethods: (response.payload.storeInfoResponse.paymentMethods || []).map(method => ({
            id: method.id || "",
            method: method.method || ""
        })),
        color: response.payload.color || "",
    };
    form.reset(sanitizedData);
}

export const mapUpdateStoreFormValues = (data: UpdateStoreFormValues) => {
    return {
        name: data.name,
        logo: data.logo,
        color: data.color,
        description: data.description,
        physicalAddress: data.physicalAddress,
        virtualAddress: data.virtualAddress,
        phone: data.phone,
        email: data.email,
        website: data.website,
        facebook: data.facebook,
        instagram: data.instagram,
        telegram: data.telegram,
        operatingHours: data.operatingHours.map(hour => ({
            id: hour.id || uuidv4(),
            day: hour.day,
            openTime: hour.openTime,
            closeTime: hour.closeTime,
        })),
        orderOptions: data.orderOptions.map(option => ({
            id: option.id || uuidv4(),
            name: option.name,
            description: option.description,
            feeRanges: option.feeRanges.map(feeRange => ({
                id: feeRange.id || uuidv4(),
                condition: feeRange.condition,
                fee: feeRange.fee,
            })),
        })),
        paymentMethods: data.paymentMethods.map(method => ({
            id: method.id || uuidv4(),
            method: method.method,
        })),
    };
}