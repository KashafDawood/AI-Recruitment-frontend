import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./app/_lib/session";

// Define role-based protected routes
const protectedRoutes = {
  candidate: ["/candidate"],
  employer: ["/employer"],
};
const publicRoutes = ["/login"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isPublicRoute = publicRoutes.includes(path);
  const cookieStore = await cookies();
  const cookie = cookieStore.get("session")?.value;
  const session = await decrypt(cookie);

  if (!session?.userId) {
    // Redirect to login if no session is present
    if (!isPublicRoute) {
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }
  } else {
    const userRole = session.role as keyof typeof protectedRoutes;

    // Redirect to the correct dashboard if accessing the login page
    if (isPublicRoute) {
      return NextResponse.redirect(
        new URL(protectedRoutes[userRole][0], req.nextUrl)
      );
    }

    // Role-based access control
    const allowedRoutes = protectedRoutes[userRole] || [];
    if (!allowedRoutes.includes(path)) {
      return NextResponse.redirect(
        new URL(protectedRoutes[userRole][0], req.nextUrl)
      );
    }
  }

  return NextResponse.next();
}

// Apply middleware to relevant routes
export const config = {
  matcher: ["/candidate/:path*", "/employer/:path*", "/login"],
};
