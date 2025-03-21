import { BaseResponse } from "../types/base-response";
import { APIService } from "@/api/base";
import { CategoryResponse } from "../types/category-response";
import { CategoryPositionUpdate, CategoryReorderRequest, CreateCategoryFormData, UpdateCategoryRequest } from "../types/request/category-request";

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
            console.log(data)
            const response = await this.post<BaseResponse<CategoryResponse>, CreateCategoryFormData>('/categories/create', data);
            return response;
        } catch (error) {
            console.error(error)
            throw error
        }
    }
    async updateCategory(id: string, data: UpdateCategoryRequest): Promise<BaseResponse<CategoryResponse>> {
        try {
            const response = await this.put<BaseResponse<CategoryResponse>, UpdateCategoryRequest>(`/categories/${id}/update`, data);
            return response;
        } catch (error) {
            console.error(error)
            throw error
        }
    }
    async reorderCategories(storeId: string, data: CategoryPositionUpdate[]): Promise<BaseResponse<CategoryResponse[]>> {
        try {
            const request: CategoryReorderRequest = {
                storeId: storeId,
                categories: data
            }
            const response = await this.post<BaseResponse<CategoryResponse[]>, CategoryReorderRequest>('/categories/reorder', request);
            if (!response.success) {
                throw new Error(`Error: ${response.error}`);
            }
            return response;
        } catch (error) {
            console.error('Error updating order:', error);
            throw error;
        }
    }
}

export const categoryService = new CategoryService();