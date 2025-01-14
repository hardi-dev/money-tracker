import { NextResponse } from 'next/server'

interface SuccessResponse<T> {
  success: true
  data: T
  message: string
}

interface ErrorResponse {
  success: false
  error: {
    message: string
    code?: string
    details?: unknown
  }
}

type ApiResponse<T> = SuccessResponse<T> | ErrorResponse

/**
 * Creates a standardized success response
 * @param data The data to be returned
 * @param message Success message
 * @param status HTTP status code (default: 200)
 */
export function successResponse<T>(
  data: T,
  message: string = 'Operation successful',
  status: number = 200
): NextResponse<SuccessResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
    },
    { status }
  )
}

/**
 * Creates a standardized error response
 * @param message Error message
 * @param code Error code (optional)
 * @param details Additional error details (optional)
 * @param status HTTP status code (default: 400)
 */
export function errorResponse(
  message: string,
  code?: string,
  details?: unknown,
  status: number = 400
): NextResponse<ErrorResponse> {
  const error: ErrorResponse['error'] = {
    message,
  }
  
  if (code) {
    error.code = code
  }
  
  if (details) {
    error.details = details
  }

  return NextResponse.json(
    {
      success: false,
      error,
    },
    { status }
  )
}

/**
 * Type guard to check if response is a success response
 */
export function isSuccessResponse<T>(
  response: ApiResponse<T>
): response is SuccessResponse<T> {
  return response.success === true
}

/**
 * Type guard to check if response is an error response
 */
export function isErrorResponse(
  response: ApiResponse<unknown>
): response is ErrorResponse {
  return response.success === false
}
