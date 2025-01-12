import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { validateApiKey } from "@/lib/middleware/api-auth"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate API key
    const authResponse = await validateApiKey(request)
    if (authResponse.status !== 200) {
      return authResponse
    }

    // Get user ID from validated request
    const userId = request.headers.get("x-user-id")
    const permissions = JSON.parse(request.headers.get("x-api-permissions") || "[]")

    // Check permission
    if (!permissions.includes("transactions.delete")) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      )
    }

    // Delete transaction
    const { error } = await supabase
      .from("transactions")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", params.id)
      .eq("user_id", userId)

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Delete transaction error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
