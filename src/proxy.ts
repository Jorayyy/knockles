import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";

const PUBLIC_ADMIN_PATHS = ["/admin/login"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPage =
    pathname === "/admin" || pathname.startsWith("/admin/");
  const isProtectedApi = pathname.startsWith("/api/admin/");

  if (!isAdminPage && !isProtectedApi) {
    return NextResponse.next();
  }

  if (PUBLIC_ADMIN_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (verifySessionToken(token)) {
    return NextResponse.next();
  }

  if (isProtectedApi) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
