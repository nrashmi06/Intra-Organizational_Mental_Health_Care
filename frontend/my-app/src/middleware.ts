import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { parseCookies } from 'nookies';

export function middleware(req: NextRequest) {
  const cookies = parseCookies({ req });

  const token = cookies.accessToken; // Access token from cookies
  const role = cookies.role; // Role from cookies

  const url = req.nextUrl.clone(); // Clone the URL object to modify pathname

 

  // Handle role-based routing for authenticated users
  if (role === 'ADMIN' && !url.pathname.startsWith('/admin')) {
    url.pathname = '/admin';
    return NextResponse.redirect(url);
  }

  if (role === 'USER' && !url.pathname.startsWith('/user')) {
    url.pathname = '/user';
    return NextResponse.redirect(url);
  }

  if (role === 'LISTENER' && !url.pathname.startsWith('/listener')) {
    url.pathname = '/listener';
    return NextResponse.redirect(url);
  }

  // If no specific condition matches, proceed to the next middleware or route
  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/admin/:path*', '/user/:path*', '/listener/:path*', '/signin'],
};
