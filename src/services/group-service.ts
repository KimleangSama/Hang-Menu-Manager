import { APIService } from "@/api/base";
import { BaseResponse } from "@/types/base-response";
import { AddOrRemoveStaffRequest, CreateStaffRequest, GroupMemberResponse } from "@/types/request/create-staff-request";

class GroupService extends APIService {
    async registerUserToGroup(data: CreateStaffRequest): Promise<BaseResponse<GroupMemberResponse>> {
        try {
            const response = await this.post<BaseResponse<GroupMemberResponse>, CreateStaffRequest>("/groups/register", data);
            return response;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    async removeUserFromGroup(data: AddOrRemoveStaffRequest): Promise<BaseResponse<GroupMemberResponse>> {
        try {
            const response = await this.post<BaseResponse<GroupMemberResponse>, AddOrRemoveStaffRequest>(`/groups/remove`, data);
            return response;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export const groupService = new GroupService();