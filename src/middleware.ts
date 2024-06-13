// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import db from "@/lib/pocketbase";

export async function middleware(request: NextRequest) {
  console.log(
    `[middleware] ${new Date().valueOf()} ${request.method} ${request.url}`,
  );
  const isLoggedIn = await db.isAuthenticated(cookies());

  if (request.nextUrl.pathname?.startsWith("/auth")) {
    console.log(`[middleware] AUTH ROUTE`);
    if (isLoggedIn) {
      console.log(`[middleware] REDIRECT TO /`);
      return NextResponse.redirect(new URL("/", request.url));
    }
    return;
  }

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
