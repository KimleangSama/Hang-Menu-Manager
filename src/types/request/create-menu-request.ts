import { z } from "zod";

export const createMenuSchema = z.object({
    code: z.string().min(1, { message: "Code is required" }),
    name: z.string().min(1, { message: "Name is required" }),
    description: z.string().optional(),
    price: z.string().optional(),
    discount: z.string().optional(),
    currency: z.string().optional(),
    image: z.string().optional(),
    images: z.array(z.string()).optional(),
    categoryId: z.string().min(1, { message: "Category is required" }),
    available: z.boolean(),
});

export type CreateMenuFormData = z.infer<typeof createMenuSchema>;