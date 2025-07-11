import { NextRequest, NextResponse } from 'next/server';


export function middleware(request: NextRequest) {

  const authToken = request.cookies.get('auth_token');

  const path = request.nextUrl.pathname;

  console.log(authToken);


  if (!authToken && path.match("dashboard")) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (authToken && !path.match("dashboard")) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard', "/"]
};