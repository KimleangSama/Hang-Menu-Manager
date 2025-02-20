import { z } from "zod";

export const createCategorySchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    description: z.string().optional(),
    icon: z.string().optional(),
    hidden: z.boolean(),
    available: z.boolean(),
});

export type CreateCategoryFormData = z.infer<typeof createCategorySchema>;