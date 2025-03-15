import { APIService } from "@/api/base";
import { BaseResponse } from "../types/base-response";
import { MenuResponse } from "../types/menu-response";
import { CreateMenuFormData, EditMenuFormData } from "../types/request/menu-request";

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
            const response = await this.get<BaseResponse<MenuResponse[]>>(`/menus/of-store/${storeId}/all/without?page=${page}&limit=${size}`);
            return response;
        } catch (error) {
            console.error(error)
            throw error
        }
    }
    async getMenuById(id: string): Promise<BaseResponse<MenuResponse>> {
        try {
            const response = await this.get<BaseResponse<MenuResponse>>(`/menus/${id}/details`);
            return response;
        } catch (error) {
            console.error(error)
            throw error
        }
    }
    async updateMenu(id: string, data: EditMenuFormData): Promise<BaseResponse<MenuResponse>> {
        try {
            const response = await this.put<BaseResponse<MenuResponse>, EditMenuFormData>(`/menus/${id}/update`, data);
            return response;
        } catch (error) {
            console.error(error)
            throw error
        }
    }
    async updateMenuCategory(menuId: string | undefined, categoryId: string): Promise<BaseResponse<MenuResponse>> {
        try {
            const response = await this.patch<BaseResponse<MenuResponse>, any>(`/menus/${menuId}/update-category?id=${categoryId}`, {
                categoryId
            });
            return response;
        } catch (error) {
            console.error(error)
            throw error
        }
    }
}

export const menuService = new MenuService();