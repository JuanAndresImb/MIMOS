import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Helper : crée un client Supabase SSR pour le middleware
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

  // Routes espace client — vérification de la session
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

  // Routes admin — vérification de la session Supabase
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

  // Routes publiques — locale unique 'fr', pas de préfixe URL
  // createIntlMiddleware n'est pas utilisé : il est conçu pour les setups multi-langues
  // et cause des rewrites inattendus avec localePrefix: "never" + locale unique.
  // next-intl lit la locale depuis getRequestConfig (fallback → 'fr').
  return NextResponse.next({
    request: { headers: request.headers },
  });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|fonts|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
