import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  // First update the session
  const supabaseResponse = await updateSession(request);

  // Then check for user session to protect routes
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const isGuest = request.cookies.get("agora_guest")?.value === "true";

  // If no user AND no guest cookie, AND trying to access app routes, redirect to welcome
  // We exclude /welcome, /onboard, and auth/callback if it exists
  const isAuthRoute = request.nextUrl.pathname.startsWith("/welcome") || 
                      request.nextUrl.pathname.startsWith("/onboard");
  
  if (!user && !isGuest && !isAuthRoute) {
    return NextResponse.redirect(new URL("/welcome", request.url));
  }

  // If user is logged in and trying to access auth routes, redirect to home
  if (user && isAuthRoute) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this matcher to fit your needs.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
