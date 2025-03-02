export interface BaseResponse<T> {
    success: boolean
    status?: string
    statusCode?: number
    payload: T
    /* eslint-disable @typescript-eslint/no-explicit-any */
    error?: any
    timestamp: string
}