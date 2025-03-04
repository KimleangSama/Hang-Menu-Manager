import { BaseResponse } from "../types/base-response";
import { APIService } from "@/api/base";
import { UserResponse } from "@/types/user-response";

class UserService extends APIService {
    async getMyGroupUsers(groupId: string): Promise<BaseResponse<UserResponse[]>> {
        try {
            const response = await this.get<BaseResponse<UserResponse[]>>(`/groups/${groupId}/users`);
            return response;
        } catch (error) {
            console.error(error)
            throw error
        }
    }
}

export const userService = new UserService();