import { NextResponse, type NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/meal-plan", "/items/add", "/items/manage"];

export default async function authProxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  if (!isProtected) return NextResponse.next();

  const sessionCookie =
    request.cookies.get("better-auth.session_token") ||
    request.cookies.get("__Secure-better-auth.session_token");

  if (!sessionCookie?.value) {
    return NextResponse.redirect(new URL("/login?redirect=" + pathname, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/meal-plan/:path*", "/items/add/:path*", "/items/manage/:path*"],
};
