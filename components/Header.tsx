'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Menu, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ModeToggle } from './ModeToggle';

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 border-b bg-background z-50">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-blue-600">Trilha</span>
          <span className="text-xl font-bold text-red-600">Aprovado</span>
        </Link>

        {/* Ações lado direito */}
        <div className="flex items-center space-x-3">
          {/* Botões só aparecem no desktop */}
          <div className="hidden md:flex items-center space-x-3">
            {!session ? (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/entrar">
                    <User className="h-4 w-4 mr-2" />
                    Entrar
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/cadastro/usuario">Cadastro</Link>
                </Button>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{session.user?.email ?? 'Minha Conta'}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })}>
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            {session && (
              <Button asChild>
                <Link href="/meus-agendamentos">Meus Agendamentos</Link>
              </Button>
            )}
          </div>

          {/* Menu mobile */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>

          {/* Dark/Light toggle */}
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
