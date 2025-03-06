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
    async updateOrderStatus(id: string | undefined, status: string): Promise<BaseResponse<OrderResponse>> {
        try {
            if (id) {
                const response = await this.patch<BaseResponse<OrderResponse>, string>(`/orders/${id}/update?status=${status}`, '');
                return response;
            }
            throw new Error('Order ID is required')
        } catch (error) {
            console.error(error)
            throw error
        }
    }
}

export const orderService = new OrderService();