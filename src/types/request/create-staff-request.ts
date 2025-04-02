import { z } from "zod";
import { GroupResponse, UserResponse } from "../user-response";

export const createStaffSchema = z.object({
    groupId: z.string().min(1, { message: "Group is required" }),
    fullname: z.string().optional(),
    username: z.string().min(8, { message: "Username must be at least 8 characters" }),
    password: z.string().min(8, { message: "Password must be at least 6 characters" }),
    phone: z.string().optional(),
    address: z.string().optional(),
    emergencyContact: z.string().optional(),
    emergencyRelation: z.string().optional(),
    roles: z.array(z.string()).min(1, { message: "At least one role is required" }),
    storeId: z.string().optional(),
});

export type CreateStaffFormData = z.infer<typeof createStaffSchema>;

export interface CreateStaffRequest {
    groupId: string;
    fullname?: string;
    username?: string;
    password: string;
    phone?: string;
    address?: string;
    emergencyContact?: string;
    emergencyRelation?: string;
    roles: string[];
    storeId?: string;
}

export interface GroupMemberResponse {
    user: UserResponse,
    group: GroupResponse
}    

export interface AddOrRemoveStaffRequest {
    groupId: string;
    userId: string;
    username: string
}