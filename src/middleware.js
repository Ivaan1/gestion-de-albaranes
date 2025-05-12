import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("jwt");

  if (!token) {
    const loginUrl = new URL("/", request.url);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
    matcher: [
      "/((?!_next/static|_next/image|favicon.ico|auth/register|public/|$).*)",
    ],
  };
  