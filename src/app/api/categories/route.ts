import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { validateApiKey } from "@/lib/middleware/api-auth"

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
            "x-api-key": apiKey || "",
          },
        },
      }
    )

    // Get categories
    const { data: categories, error } = await supabase
      .from("categories")
      .select("id, name, type")
      .eq("user_id", userId)
      .is("deleted_at", null)
      .order("name")

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error getting categories:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
