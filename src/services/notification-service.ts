import { APIService } from "@/api/base";
import { BaseResponse } from "../types/base-response";
import { NotificationResponse } from "@/types/notification-response";

class NotificationService extends APIService {
    async findAllNotificationsByStoreId(storeId: string): Promise<BaseResponse<NotificationResponse[]>> {
        try {
            const response = await this.get<BaseResponse<NotificationResponse[]>>(`/notifications/of-store/${storeId}/list`);
            return response;
        } catch (error) {
            console.error(error)
            throw error
        }
    }
    async markAsRead(storeId: string, notificationId: string): Promise<BaseResponse<NotificationResponse>> {
        try {
            const response = await this.patch<BaseResponse<NotificationResponse>, object>(`/notifications/mark-as-read`, {
                storeId,
                notificationId
            });
            return response;
        } catch (error) {
            console.error(error)
            throw error
        }
    }
    async deleteAllByStoreId(id: string) {
        try {
            const response = await this.delete<BaseResponse<null>>(`/notifications/of-store/${id}/delete/all`);
            return response;
        } catch (error) {
            console.error(error)
            throw error
        }
    }
}

export const notificationService = new NotificationService();