import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // Se não for mentor → manda para a home
    if (req.nextauth?.token?.role !== 'mentor') {
      console.log(req.nextauth?.token?.role);
      return NextResponse.redirect(new URL('/', req.url));
    }
  },
  {
    callbacks: {
      // Garante que precisa estar logado
      authorized: ({ token }) => !!token,
    },
  },
);

// Protege todas as rotas que começam com /mentor
export const config = {
  matcher: ['/mentor/:path*'],
  api: {
    bodyParser: false, // Garante corpo cru em ambientes que ainda processam (Vercel included)
  },
};
