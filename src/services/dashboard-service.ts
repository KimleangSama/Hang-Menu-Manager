import { OverviewResponse } from "@/types/overview-response";
import { BaseResponse } from "../types/base-response";
import { APIService } from "@/api/base";

class DashboardService extends APIService {
    async getDashboardOverview(storeId: string): Promise<BaseResponse<OverviewResponse>> {
        try {
            const response = await this.get<BaseResponse<OverviewResponse>>(`/dashboards/overview?storeId=${storeId}`);
            return response;
        } catch (error) {
            console.error(error)
            throw error
        }
    }
}

export const dashboardService = new DashboardService();