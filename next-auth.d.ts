import { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role?: string | null; // agora o session.user.role existe
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    id: string;
    role?: string | null; // adiciona role no User
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role?: string | null; // adiciona role no token
  }
}
