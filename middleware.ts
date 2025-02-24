import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./app/_lib/session";

const protectedRoutes = {
  candidate: ["/candidate"],
  employer: ["/employer"],
};
const publicRoutes = ["/login", "/signup"]; // signup is already included here

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

    // Redirect to the correct dashboard if accessing login or signup page
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

// Update matcher to include signup route
export const config = {
  matcher: ["/candidate/:path*", "/employer/:path*", "/login", "/signup"],
};
