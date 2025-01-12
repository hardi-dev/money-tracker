import { type NextRequest } from "next/server"
import { validateApiKey } from "@/lib/middleware/api-auth"

export async function middleware(request: NextRequest) {
  return await validateApiKey(request)
}

export const config = {
  matcher: ["/api/transactions/:path*"],
}
