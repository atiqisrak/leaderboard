import { NextResponse } from "next/server";

export function middleware(request) {
  const userCookie = request.cookies.get("user");
  const isAuthPage = request.nextUrl.pathname.startsWith("/auth");
  const isApiRoute = request.nextUrl.pathname.startsWith("/api");
  const isPublicRoute =
    request.nextUrl.pathname === "/" || request.nextUrl.pathname === "/feed";

  // Allow API routes to handle their own authentication
  if (isApiRoute) {
    // Only protect reaction, comment, and post creation endpoints
    if (
      request.nextUrl.pathname.includes("/reactions") ||
      request.nextUrl.pathname.includes("/comments") ||
      (request.nextUrl.pathname === "/api/feed" && request.method === "POST")
    ) {
      if (!userCookie) {
        return NextResponse.json(
          { success: false, message: "Authentication required" },
          { status: 401 }
        );
      }
    }
    return NextResponse.next();
  }

  // Allow public access to feed
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Redirect to login if accessing protected routes without authentication
  if (!userCookie && !isAuthPage) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Redirect to home if accessing auth pages while authenticated
  if (userCookie && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
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
     * - public folder and all its contents
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
