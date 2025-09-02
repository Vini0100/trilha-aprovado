import type React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/providers/query-provider';
import { ThemeProvider } from '@/providers/theme-provider';
import { Header } from '@/components/Header';
import { AuthProvider } from '@/providers/SessionProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Next.js App',
  description: 'Aplicação Next.js com Tailwind, Vitest, React Query e shadcn/ui',
  generator: 'v0.app',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <AuthProvider>
              <Header />
              {children}
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
