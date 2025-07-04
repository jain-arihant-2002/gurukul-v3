import { ApiResponseType } from "@/utils/types"

/**
 * Creates a standardized API response object
 * @param data - The response data
 * @param code - HTTP status code
 * @param message - Optional message
 * @returns Standardized API response
 */
export function ApiResponse<T = null>(
    data: T,
    code: number = 200,
    message: string = ''
): ApiResponseType<T> {
    // Success responses (2xx)
    if (code >= 200 && code < 300) {
        return {
            success: true,
            data,
            code,
            message: message || 'Request successful',
            error: null
        }
    }

    // Redirection responses (3xx)
    if (code >= 300 && code < 400) {
        return {
            success: true,
            data,
            code,
            message: message || 'Redirection',
            error: null
        }
    }

    // Client error responses (4xx)
    if (code >= 400 && code < 500) {
        return {
            success: false,
            data,
            code,
            message: message || 'Client error',
            error: getErrorMessage(code)
        }
    }

    // Server error responses (5xx)
    if (code >= 500 && code < 600) {
        return {
            success: false,
            data,
            code,
            message: message || 'Server error',
            error: getErrorMessage(code)
        }
    }

    // Invalid status code
    return {
        success: false,
        data: null,
        code: 500,
        message: 'Invalid status code provided',
        error: `Invalid HTTP status code: ${code}`
    }
}

/**
 * Get default error message for common HTTP status codes
 */
function getErrorMessage(code: number): string {
    const errorMessages: Record<number, string> = {
        400: 'Bad Request',
        401: 'Unauthorized',
        403: 'Forbidden',
        404: 'Not Found',
        405: 'Method Not Allowed',
        409: 'Conflict',
        422: 'Unprocessable Entity',
        429: 'Too Many Requests',
        500: 'Internal Server Error',
        502: 'Bad Gateway',
        503: 'Service Unavailable',
        504: 'Gateway Timeout'
    }

    return errorMessages[code] || 'Unknown Error'
}

/**
 * Convenience functions for common responses
 */
export const ApiResponses = {
    success: <T>(data: T, message?: string) => ApiResponse(data, 200, message),
    created: <T>(data: T, message?: string) => ApiResponse(data, 201, message),
    badRequest: (message?: string) => ApiResponse(null, 400, message),
    unauthorized: (message?: string) => ApiResponse(null, 401, message),
    forbidden: (message?: string) => ApiResponse(null, 403, message),
    notFound: (message?: string) => ApiResponse(null, 404, message),
    conflict: (message?: string) => ApiResponse(null, 409, message),
    unprocessableEntity: (message?: string) => ApiResponse(null, 422, message),
    internalServerError: (message?: string) => ApiResponse(null, 500, message),
    serviceUnavailable: (message?: string) => ApiResponse(null, 503, message),
}