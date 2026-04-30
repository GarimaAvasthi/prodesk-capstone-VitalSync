import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authState = request.cookies.get("vitalsync-auth")?.value;

  // Parse auth state to check if user is authenticated
  let isAuthenticated = false;
  try {
    if (authState) {
      const parsed = JSON.parse(authState);
      isAuthenticated = parsed.state?.isAuthenticated || false;
    }
  } catch {
    isAuthenticated = false;
  }

  // Allow static assets
  if (
    pathname.includes('.') || 
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api')
  ) {
    return NextResponse.next();
  }

  // Public routes
  const isPublicRoute = pathname === "/" || pathname === "/login" || pathname === "/signin" || pathname === "/forgot-password";

  if (isPublicRoute) {
    // If already logged in, redirect to dashboard
    if (isAuthenticated && (pathname === "/login" || pathname === "/signin")) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // Protected routes
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
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
