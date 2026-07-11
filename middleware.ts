import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ROLES = {
  ONPE: 'onpe',
  PERSONERO: 'personero',
  MIEMBRO_MESA: 'miembro_mesa',
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

  const isProtectedPath = pathname.startsWith('/onpe') || pathname.startsWith('/personeros') || pathname.startsWith('/mesa');

  // Si no hay rol y trata de acceder a rutas protegidas, al login (/)
  if (!role && isProtectedPath) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Protección ruta /onpe
  if (pathname.startsWith('/onpe') && role !== ROLES.ONPE) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Protección ruta /personeros
  if (pathname.startsWith('/personeros') && role !== ROLES.PERSONERO) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Protección ruta /mesa
  if (pathname.startsWith('/mesa') && role !== ROLES.MIEMBRO_MESA) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/onpe/:path*', '/personeros/:path*', '/mesa/:path*'],
};

