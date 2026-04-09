import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Proxy function for handling server-side redirects and rewrites.
 * In Next.js 16+, this replaces middleware.ts.
 */
export function proxy(request: NextRequest) {
  // Redirect root to /home to match arcade naming scheme
  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Only target the root path for this redirection
  matcher: "/",
};
