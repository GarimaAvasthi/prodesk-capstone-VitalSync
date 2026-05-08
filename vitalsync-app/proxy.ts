/**
 * Next.js middleware for authentication and route protection
 * Handles authentication checks and route redirects
 */

import { NextRequest, NextResponse } from "next/server";
import { PUBLIC_ROUTES, PROTECTED_ROUTES, AUTH_ROUTES } from "./lib/constants";

/**
 * Middleware to protect routes and handle authentication
 */
export default function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  const authState = request.cookies.get("vitalsync-auth")?.value;

  // Parse authentication state
  let isAuthenticated = false;
  try {
    if (authState) {
      const parsed = JSON.parse(authState);
      isAuthenticated = parsed.state?.isAuthenticated || false;
    }
  } catch (error) {
    console.warn("Failed to parse auth state:", error);
    isAuthenticated = false;
  }

  // Allow static assets and API routes
  if (
    pathname.includes(".") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  // Check if route is public
  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname === route);

  if (isPublicRoute) {
    // Redirect authenticated users away from login pages
    if (
      isAuthenticated &&
      (pathname === AUTH_ROUTES.LOGIN || pathname === AUTH_ROUTES.SIGNIN)
    ) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // Check if route is protected
  const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));

  if (isProtectedRoute && !isAuthenticated) {
    // Redirect unauthenticated users to login
    const loginUrl = new URL(AUTH_ROUTES.LOGIN, request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public assets)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
