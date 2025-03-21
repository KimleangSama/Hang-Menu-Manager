import { z } from "zod";

export const createCategorySchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    description: z.string().optional(),
    icon: z.string().optional(),
    hidden: z.boolean(),
    available: z.boolean(),
    storeId: z.string().min(1, { message: "Store ID is required" }),
});

export type CreateCategoryFormData = z.infer<typeof createCategorySchema>;

export interface CategoryReorderRequest {
    storeId: string;
    categories: CategoryPositionUpdate[];
}

export interface CategoryPositionUpdate {
    id: string;
    name: string;
    position: number;
}

export interface UpdateCategoryRequest {
    name: string;
    description: string;
    storeId: string
}