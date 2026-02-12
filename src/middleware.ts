import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        request.cookies.set(name, value);
                    });
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // Refresh session if expired
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const path = request.nextUrl.pathname;
    const isAuthPage = path.startsWith("/auth");
    const isAdminSaasPage = path.startsWith("/admin-saas");
    const isAdminSaasLoginPage = path === "/admin-saas/login";
    const isApiCheckTables = path.startsWith("/api/check-tables");

    // 1. API Pass-through (Emergency Diagnostics)
    if (isApiCheckTables) {
        return response;
    }

    // 2. Admin SaaS Protection
    if (!user && isAdminSaasPage && !isAdminSaasLoginPage) {
        return NextResponse.redirect(new URL("/admin-saas/login", request.url));
    }

    // 2. CRM Protection (Default)
    if (!user && !isAuthPage && !isAdminSaasPage) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // 3. Redirect away from auth pages if logged in
    if (user) {
        if (isAuthPage) {
            return NextResponse.redirect(new URL("/", request.url));
        }
        if (isAdminSaasLoginPage) {
            return NextResponse.redirect(new URL("/admin-saas", request.url));
        }
    }

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
