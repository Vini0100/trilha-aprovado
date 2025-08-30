'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { ModeToggle } from './ModeToggle';

export function Header() {
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
            <Button variant="ghost" asChild>
              <Link href="/entrar">Entrar</Link>
            </Button>
            <Button asChild>
              <Link href="/planos">Conheça os planos</Link>
            </Button>
          </div>

          {/* Menu mobile */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>

          {/* Dark/Light toggle (sempre visível) */}
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
