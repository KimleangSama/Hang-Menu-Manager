import { BaseResponse } from "../types/base-response";
import { FileResponse } from "../types/request/file-response";
import axios from "axios";
import { ACCESS_TOKEN, API_BASE_URL } from "@/constants/auth";

class FileService {
    async uploadFile(formData: FormData): Promise<BaseResponse<FileResponse>> {
        try {
            const token = JSON.parse(localStorage.getItem(ACCESS_TOKEN) || '{}');
            if (token && token.state.accessToken) {
                const response = await axios.post<BaseResponse<FileResponse>>(`${API_BASE_URL}/files/upload`, formData, {
                    headers: {
                        'Authorization': `Bearer ${token.state.accessToken}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                console.log(response)
                return response.data;
            }
            throw new Error('Token not found');
        } catch (error) {
            console.error(error)
            throw error
        }
    }
}

export const fileService = new FileService();