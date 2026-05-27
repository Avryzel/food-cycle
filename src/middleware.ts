import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function middleware(request: NextRequest) {
    const response = NextResponse.next();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

    const token = request.cookies.get("sb-access-token")?.value;

    const { data: { user } } = await supabaseClient.auth.getUser(token);
    const currentPath = request.nextUrl.pathname;

    if (!user && (currentPath.startsWith("/inventory") || currentPath.startsWith("/staples"))) {
        const loginUrl = new URL("/login", request.url);
        return NextResponse.redirect(loginUrl);
    }

    if (user && (currentPath === "/login" || currentPath === "/register")) {
        const dashboardUrl = new URL("/inventory", request.url);
        return NextResponse.redirect(dashboardUrl);
    }

    return response;
}

export const config = {
    matcher: [
        "/inventory/:path*",
        "/staples/:path*",
        "/login",
        "/register"
    ],
};