import { APIService } from "@/api/base";
import { BaseResponse } from "../types/base-response";
import { OrderListResponse, OrderResponse } from "@/types/order-response";

class OrderService extends APIService {
    async listOrders(storeId: string): Promise<BaseResponse<OrderListResponse[]>> {
        try {
            const response = await this.get<BaseResponse<OrderListResponse[]>>(`/orders/of-store/${storeId}/list`);
            return response;
        } catch (error) {
            console.error(error)
            throw error
        }
    }
    async getOrderResponseById(id: string): Promise<BaseResponse<OrderResponse>> {
        try {
            const response = await this.get<BaseResponse<OrderResponse>>(`/orders/${id}/details`);
            return response;
        } catch (error) {
            console.error(error)
            throw error
        }
    }
}

export const orderService = new OrderService();