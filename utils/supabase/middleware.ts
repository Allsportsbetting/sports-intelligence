import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  // Skip auth for public routes that don't need protection
  const publicRoutes = ['/', '/join-now', '/login'];
  const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname);
  
  let supabaseResponse = NextResponse.next({
    request,
  });

  // Only create Supabase client for protected routes or when necessary
  if (!isPublicRoute || request.nextUrl.pathname.startsWith('/modify')) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            supabaseResponse = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    let user = null;
    
    try {
      // Only check auth for protected routes
      if (request.nextUrl.pathname.startsWith('/modify') || request.nextUrl.pathname.startsWith('/user_dashboard')) {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();
        user = authUser;
      }
    } catch (error) {
      // Log the error but don't break the middleware
      console.warn('Supabase auth error in middleware:', error);
      // For protected routes, redirect to login on auth failure
      if (request.nextUrl.pathname.startsWith('/modify') || request.nextUrl.pathname.startsWith('/user_dashboard')) {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        url.searchParams.set('error', 'Authentication service temporarily unavailable. Please try again.');
        return NextResponse.redirect(url);
      }
    }

    // Protect /modify route - require authentication and admin role
    if (request.nextUrl.pathname.startsWith('/modify')) {
      if (!user) {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
      }
      
      // Check if user has admin role
      const userRole = user.app_metadata?.role;
      if (userRole !== 'admin') {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        url.searchParams.set('error', 'Access denied. Admin privileges required.');
        return NextResponse.redirect(url);
      }
    }
  }

  return supabaseResponse;
}
