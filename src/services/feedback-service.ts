import { BaseResponse } from "../types/base-response";
import { APIService } from "@/api/base";
import { FeedbackResponse } from "@/types/feedback-response";

class FeedbackService extends APIService {
    async getFeedbackByStoreId(storeId: string): Promise<BaseResponse<FeedbackResponse[]>> {
        try {
            const response = await this.get<BaseResponse<FeedbackResponse[]>>(`/feedbacks/list?storeId=${storeId}`);
            return response;
        } catch (error) {
            console.error(error)
            throw error
        }
    }
}

export const feedbackService = new FeedbackService();