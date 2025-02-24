import { z } from "zod";

export const createMenuSchema = z.object({
    code: z.string().optional(),
    name: z.string().min(1, { message: "Name is required" }),
    description: z.string().optional(),
    price: z.string().optional(),
    discount: z.string().optional(),
    currency: z.string().optional(),
    image: z.string().optional(),
    images: z.array(z.object({
        name: z.string().optional(),
        url: z.string().optional(),
    })).optional(),
    categoryId: z.string().min(1, { message: "Category is required" }),
    available: z.boolean(),
    storeId: z.string().min(1, { message: "Store is required" }),
});

export type CreateMenuFormData = z.infer<typeof createMenuSchema>;