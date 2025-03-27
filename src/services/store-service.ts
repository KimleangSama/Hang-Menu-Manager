import { BaseResponse } from "../types/base-response";
import { StoreResponse } from "../types/store-response";
import { APIService } from "@/api/base";
import { UpdateStoreRequest } from "../types/request/update-store-request";

class StoreService extends APIService {
    async updateStoreInfo(id: string, updateRequest: UpdateStoreRequest): Promise<BaseResponse<StoreResponse>> {
        try {
            const response = await this.put<BaseResponse<StoreResponse>, UpdateStoreRequest>(`/stores/${id}/update`, updateRequest);
            return response;
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    async updateStoreLayout(id: string, layout: string) {
        try {
            const response = await this.patch<BaseResponse<StoreResponse>, object>(`/stores/${id}/layout?layout=${layout}`, {});
            return response;
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    async getStoreOfUser(): Promise<BaseResponse<StoreResponse>> {
        try {
            const response = await this.get<BaseResponse<StoreResponse>>(`/stores/mine`);
            return response;
        } catch (error) {
            console.error(error)
            throw error
        }
    }
}

export const storeService = new StoreService();