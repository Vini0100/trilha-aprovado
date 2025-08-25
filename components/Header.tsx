"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export function Header() {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-blue-600">Trilha</span>
          <span className="text-xl font-bold text-red-600">Aprovado</span>
        </Link>

        {/* Menu central */}
        <NavigationMenu className="hidden md:block">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Mentorias</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="p-4 w-56">
                  <ul className="space-y-2">
                    <li>
                      <Link href="/mentoria/concursos">Concursos</Link>
                    </li>
                    <li>
                      <Link href="/mentoria/redacao">Redação</Link>
                    </li>
                    <li>
                      <Link href="/mentoria/estrategia">Estratégia</Link>
                    </li>
                  </ul>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/planos">Planos</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/blog">Blog</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/contato">Contato</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Ações lado direito */}
        <div className="flex items-center space-x-3">
          <Button variant="ghost" asChild>
            <Link href="/entrar">Entrar</Link>
          </Button>
          <Button asChild>
            <Link href="/planos">Conheça os planos</Link>
          </Button>

          {/* Menu mobile */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
