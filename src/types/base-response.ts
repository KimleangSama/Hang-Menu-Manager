export interface BaseResponse<T> {
    success: boolean
    status?: string
    statusCode?: number
    payload: T
    error?: any
    timestamp: string
}