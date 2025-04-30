import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./app/_lib/session";

const protectedRoutes = {
  candidate: [
    "/candidate",
    "/candidate/profile",
    "/candidate/jobs",
    "/candidate/savedjobs",
  ],
  employer: [
    "/employer",
    "/employer/blogs",
    "/employer/create-blog",
    "/employer/edit-blog",
    "/employer/edit-blog/:slug",
    "/employer/profile",
    "/employer/create-job",
    "/employer/my-joblistings",
    "/employer/my-joblistings/job-detail",
    "/employer/my-joblistings/edit-job",
  ],
};
const publicRoutes = ["/login", "/signup"];

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
    if (!isAllowedRoute(path, allowedRoutes)) {
      return NextResponse.redirect(
        new URL(protectedRoutes[userRole][0], req.nextUrl)
      );
    }
  }

  return NextResponse.next();
}

const isAllowedRoute = (path: string, allowedRoutes: string[]) => {
  return allowedRoutes.some((route) => {
    const routeRegex = new RegExp(`^${route.replace(/:\\w+/g, "\\w+")}$`);
    return routeRegex.test(path);
  });
};

// Update matcher to include signup route
export const config = {
  matcher: ["/candidate/:path*", "/employer/:path*", "/login", "/signup"],
};
