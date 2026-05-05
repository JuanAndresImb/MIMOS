import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { routing } from "./i18n/routing";

const VALID_LOCALES = routing.locales as readonly string[];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  function makeSupabaseClient(response: NextResponse) {
    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return request.cookies.getAll(); },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              request.cookies.set(name, value);
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );
  }

  // Admin auth
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const response = NextResponse.next({ request: { headers: request.headers } });
    const { data: { user } } = await makeSupabaseClient(response).auth.getUser();
    if (!user) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      return NextResponse.redirect(loginUrl);
    }
    return response;
  }

  // Compte auth
  if (pathname.startsWith("/compte") && pathname !== "/compte/connexion") {
    const response = NextResponse.next({ request: { headers: request.headers } });
    const { data: { user } } = await makeSupabaseClient(response).auth.getUser();
    if (!user) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/compte/connexion";
      return NextResponse.redirect(loginUrl);
    }
    return response;
  }

  // Locale via cookie — injecte x-next-intl-locale pour getRequestConfig
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  const locale = VALID_LOCALES.includes(cookieLocale ?? "") ? cookieLocale! : routing.defaultLocale;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-next-intl-locale", locale);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|fonts|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
