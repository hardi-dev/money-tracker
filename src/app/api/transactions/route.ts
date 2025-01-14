import { type NextRequest } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { validateApiKey } from "@/lib/middleware/api-auth"
import { transactionFormSchema } from "@/features/transactions/schemas/transaction.schema"
import { successResponse, errorResponse } from '@/lib/api-response'
import { ZodError } from "zod"

export async function POST(request: NextRequest) {
  try {
    // Validate API key
    const authResponse = await validateApiKey(request)
    if (authResponse instanceof Response && authResponse.status !== 200) {
      return authResponse
    }

    // Get user ID and permissions from validated request
    const userId = authResponse.headers.get("x-user-id")
    const apiKey = request.headers.get("x-api-key")
    const permissions = JSON.parse(authResponse.headers.get("x-api-permissions") || "[]")

    console.log("Request headers:", {
      userId,
      apiKey,
      permissions,
    })

    // Check permission
    if (!permissions.includes("transactions.create")) {
      return errorResponse(
        "Insufficient permissions",
        "PERMISSION_ERROR",
        { required: "transactions.create" },
        403
      )
    }

    // Get and validate request body
    const body = await request.json()
    
    try {
      transactionFormSchema.parse(body)
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.reduce((acc, err) => {
          const field = err.path.join('.')
          acc[field] = err.message
          return acc
        }, {} as Record<string, string>)

        return errorResponse(
          "Invalid request data",
          "VALIDATION_ERROR",
          formattedErrors,
          400
        )
      }
      throw error
    }

    // Create Supabase client with request headers
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            // Pass the API key for RLS
            "x-api-key": apiKey || "",
          },
        },
      }
    )

    // Create transaction
    const { data: transaction, error } = await supabase
      .from("transactions")
      .insert({
        ...body,
        user_id: userId,
      })
      .select()
      .single()

    if (error) {
      console.error("Transaction error:", error)
      return errorResponse(
        error.message,
        "DATABASE_ERROR",
        { code: error.code, details: error.details },
        400
      )
    }

    return successResponse(
      transaction,
      "Transaction created successfully",
      201
    )
  } catch (error) {
    console.error("Error creating transaction:", error)
    return errorResponse(
      "Failed to create transaction",
      "INTERNAL_ERROR",
      error instanceof Error ? error.message : undefined,
      500
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Validate API key
    const authResponse = await validateApiKey(request)
    if (authResponse instanceof Response && authResponse.status !== 200) {
      return authResponse
    }

    // Get user ID and API key
    const userId = authResponse.headers.get("x-user-id")
    const apiKey = request.headers.get("x-api-key")

    // Create Supabase client with request headers
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            // Pass the API key for RLS
            "x-api-key": apiKey || "",
          },
        },
      }
    )

    // Get transactions
    const { data: transactions, error } = await supabase
      .from("transactions")
      .select()
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      return errorResponse(
        error.message,
        "DATABASE_ERROR",
        { code: error.code, details: error.details },
        400
      )
    }

    // Parse each transaction through the schema
    const parsedTransactions = transactions?.map(transaction => 
      transactionFormSchema.parse(transaction)
    ) || []

    return successResponse(
      parsedTransactions,
      "Transactions retrieved successfully"
    )
  } catch (error) {
    console.error("Error getting transactions:", error)
    return errorResponse(
      "Failed to fetch transactions",
      "INTERNAL_ERROR",
      error instanceof Error ? error.message : undefined,
      500
    )
  }
}
