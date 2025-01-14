import { successResponse, errorResponse } from '@/lib/api-response'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Example validation
    if (!body.name) {
      return errorResponse(
        'Name is required',
        'VALIDATION_ERROR',
        { field: 'name' }
      )
    }

    // Example database operation
    const result = { id: 1, ...body }

    return successResponse(
      result,
      'Item created successfully',
      201
    )
  } catch (error) {
    console.error('Create item error:', error)
    return errorResponse(
      'Failed to create item',
      'INTERNAL_ERROR',
      error instanceof Error ? error.message : undefined,
      500
    )
  }
}
