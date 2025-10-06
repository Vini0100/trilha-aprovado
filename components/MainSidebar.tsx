"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { 
  Home, 
  User, 
  Calendar, 
  BookOpen, 
  CalendarCheck,
  PlusCircle
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from "@/components/ui/sidebar";

/**
 * Sidebar principal da aplicação
 * Exibe navegação baseada no tipo de usuário (geral/mentor)
 * Mostra rotas de mentor apenas se o usuário for mentor
 */
export function MainSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  
  // Verifica se o usuário é mentor
  const isMentor = session?.user && session.user.role === 'mentor';

  // Rotas gerais disponíveis para todos os usuários
  const generalRoutes = [
    {
      label: "Início",
      href: "/",
      icon: Home,
    },
  ];

  // Rotas para usuários logados
  const userRoutes = session ? [
    {
      label: "Meus Agendamentos",
      href: "/meus-agendamentos",
      icon: Calendar,
    },
  ] : [
    {
      label: "Entrar",
      href: "/entrar",
      icon: User,
    },
    {
      label: "Cadastro Usuário",
      href: "/cadastro/usuario",
      icon: PlusCircle,
    },
    {
      label: "Cadastro Mentor",
      href: "/cadastro/mentor",
      icon: BookOpen,
    },
  ];

  // Rotas exclusivas para mentores
  const mentorRoutes = isMentor ? [
    {
      label: "Dashboard",
      href: "/mentor/dashboard",
      icon: BookOpen,
    },
    {
      label: "Agendamentos",
      href: "/mentor/agendamentos",
      icon: CalendarCheck,
    },
  ] : [];

  return (
    <Sidebar collapsible="icon" className="border-r bg-background">
      <SidebarContent className="overflow-y-auto bg-background">
        {/* Navegação Geral */}
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {generalRoutes.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
                      <Link href={item.href} prefetch={false}>
                        <Icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Área do Usuário */}
        <SidebarGroup>
          <SidebarGroupLabel>
            {session ? "Minha Conta" : "Acesso"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {userRoutes.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
                      <Link href={item.href} prefetch={false}>
                        <Icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Área Mentor - só aparece se for mentor */}
        {mentorRoutes.length > 0 && (
          <>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupLabel>Área do Mentor</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {mentorRoutes.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
                          <Link href={item.href} prefetch={false}>
                            <Icon />
                            <span>{item.label}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>
    </Sidebar>
  );
}