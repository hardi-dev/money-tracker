import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Updates the session by checking if the user is authenticated.
 * If not, redirects the user to the login page.
 * 
 * @param request The NextRequest object.
 * @returns The NextResponse object.
 */
export async function updateSession(request: NextRequest) {
  // Create a new response object to handle the session update.
  let supabaseResponse = NextResponse.next({
    request,
  });

  // Create a Supabase client instance with the provided URL and anon key.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        /**
         * Gets all cookies from the request
         */
        getAll() {
          return request.cookies.getAll();
        },
        /**
         * Sets multiple cookies in both request and response
         */
        setAll(cookiesList) {
          // Set cookies in request
          cookiesList.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          // Create new response with updated request
          supabaseResponse = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });

          // Set cookies in response
          cookiesList.forEach(({ name, value, ...options }) => {
            supabaseResponse.cookies.set({
              name,
              value,
              ...options,
            });
          });
        },
      },
    }
  );

  try {
    // Get the current session
    const { data: { session } } = await supabase.auth.getSession();

    // Get current pathname
    const pathname = request.nextUrl.pathname;
    
    // Define public and auth pages
    const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");
    const isPublicPage = pathname === "/" || pathname.startsWith("/api");

    // Handle auth state
    if (!session) {
      // If no session and trying to access protected route
      if (!isAuthPage && !isPublicPage) {
        const redirectUrl = new URL("/login", request.url);
        redirectUrl.searchParams.set("redirectedFrom", pathname);
        return NextResponse.redirect(redirectUrl);
      }
    } else if (isAuthPage) {
      // If has session and on auth page, redirect to dashboard
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return supabaseResponse;
  } catch (error) {
    // Handle any errors that occur during the auth process.
    console.error("Auth middleware error:", error);
    return supabaseResponse;
  }
}
