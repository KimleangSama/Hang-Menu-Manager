import { AxiosInstance, AxiosResponse } from "axios";
import axiosInstant from "./instant";

export class APIService {
    protected api: AxiosInstance;

    constructor(api: AxiosInstance = axiosInstant) {
        this.api = api;
    }

    protected async get<T>(url: string): Promise<T> {
        const response: AxiosResponse<T> = await this.api.get(url);
        return response.data;
    }

    protected async post<T, D>(url: string, data: D): Promise<T> {
        const response: AxiosResponse<T> = await this.api.post(url, data);
        return response.data;
    }

    protected async put<T, D>(url: string, data: D): Promise<T> {
        const response: AxiosResponse<T> = await this.api.put(url, data);
        return response.data;
    }

    protected async delete<T>(url: string): Promise<T> {
        const response: AxiosResponse<T> = await this.api.delete(url);
        return response.data;
    }

    protected async patch<T, D>(url: string, data: D): Promise<T> {
        const response: AxiosResponse<T> = await this.api.patch(url, data);
        return response.data;
    }
}