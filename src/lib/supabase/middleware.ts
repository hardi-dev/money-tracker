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
      // Configure the cookies to be handled by the request.
      cookies: {
        /**
         * Gets all the cookies from the request.
         * 
         * @returns The cookies from the request.
         */
        getAll() {
          return request.cookies.getAll();
        },
        /**
         * Sets all the cookies in the response.
         * 
         * @param cookiesToSet The cookies to set.
         */
        setAll(cookiesToSet) {
          // Set the cookies in the request.
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          // Create a new response object to handle the cookie update.
          supabaseResponse = NextResponse.next({
            request,
          });
          // Set the cookies in the response.
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()
  try {
    // Get the user from the Supabase auth.
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Check if the user is not authenticated and the URL is not the login page.
    if (
      !user &&
      !request.nextUrl.pathname.startsWith("/login") && 
      !request.nextUrl.pathname.startsWith("/register")
    ) {
      // no user, potentially respond by redirecting the user to the login page
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  } catch (error) {
    // Handle any errors that occur during the auth process.
    console.error("Error updating session:", error);
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}
