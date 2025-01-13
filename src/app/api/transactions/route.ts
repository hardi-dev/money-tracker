import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { validateApiKey } from "@/lib/middleware/api-auth"
import { transactionSchema } from "@/features/transactions/schemas/transaction.schema"

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
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      )
    }

    // Get request body
    const body = await request.json()

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
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(transactionSchema.parse(transaction))
  } catch (error) {
    console.error("Error creating transaction:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
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
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    // Parse each transaction through the schema
    const parsedTransactions = transactions?.map(transaction => 
      transactionSchema.parse(transaction)
    ) || []

    return NextResponse.json(parsedTransactions)
  } catch (error) {
    console.error("Error getting transactions:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
