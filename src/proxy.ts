import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Next.js 16: renamed from middleware to proxy
export function proxy(request: NextRequest) {
  const token = request.cookies.get('luxury_session_token')?.value;

  const { pathname } = request.nextUrl;
  const isAdminPath = pathname.startsWith('/admin');
  const isCheckoutPath = pathname.startsWith('/checkout');
  const isAuthPath = pathname.startsWith('/auth');

  if (!token) {
    if (isAdminPath || isCheckoutPath) {
      const url = request.nextUrl.clone();
      url.pathname = '/auth/login';
      return NextResponse.redirect(url);
    }
  } else {
    try {
      // Decode JWT payload (second part of header.payload.signature)
      const payloadPart = token.split('.')[1];
      if (payloadPart) {
        // Base64Url decode
        const base64 = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
        const decodedString = atob(base64);
        const decodedPayload = JSON.parse(decodedString);

        // Expiration check
        const isExpired = decodedPayload.exp * 1000 < Date.now();
        if (isExpired) {
          if (isAuthPath) {
            const response = NextResponse.next();
            response.cookies.delete('luxury_session_token');
            return response;
          }
          const response = NextResponse.redirect(new URL('/auth/login', request.url));
          response.cookies.delete('luxury_session_token');
          return response;
        }

        // Admin protection check
        if (isAdminPath && decodedPayload.role !== 'admin') {
          return NextResponse.redirect(new URL('/', request.url));
        }

        // Let /auth/* through — login page handles already-authenticated users.
        // Redirecting here caused a loop when a cookie existed but getAuthUser() failed.
      }
    } catch (e) {
      console.error('Proxy JWT decode error:', e);
      if (isAuthPath) {
        const response = NextResponse.next();
        response.cookies.delete('luxury_session_token');
        return response;
      }
      const response = NextResponse.redirect(new URL('/auth/login', request.url));
      response.cookies.delete('luxury_session_token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  // Cover /admin (exact) AND /admin/* sub-paths
  matcher: ['/admin', '/admin/:path*', '/checkout', '/checkout/:path*', '/auth/:path*'],
};
