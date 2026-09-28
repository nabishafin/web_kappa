import { NextResponse, type NextRequest } from "next/server";

/**
 * Route protection.
 * Signed-out visitors hitting an app route are sent to /login?next=…,
 * signed-in users hitting an auth screen are sent to /home.
 * The session cookie is set by the client store today and will be issued by
 * the API (httpOnly) once the backend is connected.
 */
const SESSION_COOKIE = "ci_session";

const PROTECTED = ["/home", "/title", "/watch", "/profile", "/settings", "/pricing", "/categories", "/search", "/support/tip"];
const AUTH_ONLY = ["/login", "/signup"];

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const signedIn = request.cookies.get(SESSION_COOKIE)?.value === "1";

  if (!signedIn && PROTECTED.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = `?next=${encodeURIComponent(pathname + search)}`;
    return NextResponse.redirect(url);
  }

  if (signedIn && AUTH_ONLY.includes(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/home";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|images|icon.png|favicon.ico|robots.txt|sitemap.xml|manifest.webmanifest).*)"],
};
