export interface BaseResponse<T> {
    success: boolean
    status?: string
    statusCode?: number
    payload: T
    error?: string
    timestamp: string
}