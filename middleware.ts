import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ROLES = {
  ADMIN: 'admin',
  PERSONERO: 'personero',
};

// Simulando la sesión del usuario
const getUserSession = (req: NextRequest) => {
  // En una app real, esto vendría de una cookie de sesión o un token JWT
  const role = req.cookies.get('user-role')?.value;
  return { role };
};

export function middleware(request: NextRequest) {
  const { role } = getUserSession(request);
  const { pathname } = request.nextUrl;

  // Si no hay rol y trata de acceder a rutas protegidas, al login
  if (!role && (pathname.startsWith('/admin') || pathname.startsWith('/personero'))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Protección ruta /admin
  if (pathname.startsWith('/admin') && role !== ROLES.ADMIN) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Protección ruta /personero
  if (pathname.startsWith('/personero') && role !== ROLES.PERSONERO) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/personero/:path*'],
};
