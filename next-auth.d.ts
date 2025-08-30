import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string; // agora o session.user.id existe
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id: string; // User também terá id como string
  }
}
