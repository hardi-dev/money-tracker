import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function validateApiKey(request: NextRequest) {
  try {
    // Get API key from header
    const apiKey = request.headers.get("x-api-key")
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is required" },
        { status: 401 }
      )
    }

    // Get API key from database
    const { data: keyData, error: keyError } = await supabase
      .from("api_keys")
      .select("id, user_id, permissions")
      .eq("key", apiKey)
      .is("deleted_at", null)
      .single()

    if (keyError || !keyData) {
      return NextResponse.json(
        { error: "Invalid API key" },
        { status: 401 }
      )
    }

    // Check if key has expired
    const { data: keyDetails } = await supabase
      .from("api_keys")
      .select("expires_at")
      .eq("key", apiKey)
      .single()

    if (keyDetails?.expires_at && new Date(keyDetails.expires_at) < new Date()) {
      return NextResponse.json(
        { error: "API key has expired" },
        { status: 401 }
      )
    }

    // Update last used timestamp
    await supabase
      .from("api_keys")
      .update({ last_used_at: new Date().toISOString() })
      .eq("key", apiKey)

    // Log API usage
    await supabase.from("api_key_usage").insert({
      api_key_id: keyData.id,
      endpoint: request.nextUrl.pathname,
      method: request.method,
      status_code: 200,
      ip_address: request.ip || request.headers.get("x-forwarded-for") || "unknown",
    })

    // Add headers to the request
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set("x-user-id", keyData.user_id)
    requestHeaders.set("x-api-permissions", JSON.stringify(keyData.permissions))

    // Return modified request
    const response = NextResponse.next()
    response.headers.set("x-user-id", keyData.user_id)
    response.headers.set("x-api-permissions", JSON.stringify(keyData.permissions))

    return response
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
