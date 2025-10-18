import type React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/providers/QueryProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { Header } from '@/components/Header';
import { AuthProvider } from '@/providers/SessionProvider';
import { Toaster } from '@/components/ui/sonner';
import { MainSidebar } from '@/components/MainSidebar';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Trilha Aprovado',
  description: 'Plataforma de mentoria online para concursos públicos',
  generator: 'v0.app',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <AuthProvider>
              <SidebarProvider>
                <div className="min-h-screen flex w-full">
                  <MainSidebar />
                  <SidebarInset className="flex-1 w-full">
                    <Header />
                    <main className="flex-1 p-4 w-full overflow-auto">
                      {children}
                    </main>
                  </SidebarInset>
                </div>
                <Toaster />
              </SidebarProvider>
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
