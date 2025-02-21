import { APIService } from "@/api/base";
import { BaseResponse } from "../types/base-response";
import { MenuResponse } from "../types/menu-response";
import { CreateMenuFormData } from "../types/request/create-menu-request";

class MenuService extends APIService {
    async createMenu(data: CreateMenuFormData): Promise<BaseResponse<MenuResponse>> {
        try {
            const response = await this.post<BaseResponse<MenuResponse>, CreateMenuFormData>('/menus/create', data);
            return response;
        } catch (error) {
            console.error(error)
            throw error
        }
    }
    async listMenus(storeId: string, page: number, size: number): Promise<BaseResponse<MenuResponse[]>> {
        try {
            const response = await this.get<BaseResponse<MenuResponse[]>>(`/menus/of-store/${storeId}/list?page=${page}&limit=${size}`);
            return response;
        } catch (error) {
            console.error(error)
            throw error
        }
    }
    async getMenuById(id: string): Promise<BaseResponse<MenuResponse>> {
        try {
            const response = await this.get<BaseResponse<MenuResponse>>(`/menus/${id}/get`);
            return response;
        } catch (error) {
            console.error(error)
            throw error
        }
    }
}

export const menuService = new MenuService();