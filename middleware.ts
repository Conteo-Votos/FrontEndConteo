
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ROLES = {
  ADMIN: 'admin',
  COORDINADOR: 'coordinador',
  AUDITOR: 'auditor',
  RURAL: 'rural',
  PERSONERO: 'personero',
};

// Simulando la sesión del usuario
const getUserSession = (req: NextRequest) => {
  // En una app real, esto vendría de una cookie de sesión o un token JWT
  const role = req.cookies.get('user-role')?.value || ROLES.PERSONERO;
  return { role };
};

export function middleware(request: NextRequest) {
  const { role } = getUserSession(request);
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/dashboard/admin') && role !== ROLES.ADMIN) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  if (pathname.startsWith('/dashboard/coordinador') && ![ROLES.ADMIN, ROLES.COORDINADOR].includes(role)) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  if (pathname.startsWith('/dashboard/auditoria') && ![ROLES.ADMIN, ROLES.AUDITOR].includes(role)) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }
  
  if (pathname.startsWith('/dashboard/rural') && ![ROLES.ADMIN, ROLES.RURAL].includes(role)) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/dashboard/:path*',
};
