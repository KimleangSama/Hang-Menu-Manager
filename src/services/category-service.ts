import { BaseResponse } from "../types/base-response";
import { APIService } from "@/api/base";
import { CategoryResponse } from "../types/category-response";
import { CreateCategoryFormData } from "../types/request/category-request";

class CategoryService extends APIService {
    async listCategories(storeId: string): Promise<BaseResponse<CategoryResponse[]>> {
        try {
            const response = await this.get<BaseResponse<CategoryResponse[]>>(`/categories/of-store/${storeId}/list`);
            return response;
        } catch (error) {
            console.error(error)
            throw error
        }
    }
    async createCategory(data: CreateCategoryFormData): Promise<BaseResponse<CategoryResponse>> {
        try {
            const response = await this.post<BaseResponse<CategoryResponse>, CreateCategoryFormData>('/categories/create', data);
            return response;
        } catch (error) {
            console.error(error)
            throw error
        }
    }
}

export const categoryService = new CategoryService();