import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const ROUTE_ROLES: Record<string, string[]> = {
  "/admin": ["ADMIN"],
  "/enseignant": ["ENSEIGNANT"],
  "/parent": ["PARENT"],
  "/orientation": ["CHARGE_ORIENTATION"],
};

export default withAuth(
  function middleware(req) {
    const path = req.nextUrl.pathname;
    const role = req.nextauth.token?.role as string | undefined;

    const matched = Object.keys(ROUTE_ROLES).find((prefix) =>
      path.startsWith(prefix)
    );

    if (matched && role && !ROUTE_ROLES[matched].includes(role)) {
      return NextResponse.redirect(new URL("/acces-refuse", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/enseignant/:path*",
    "/parent/:path*",
    "/orientation/:path*",
  ],
};
