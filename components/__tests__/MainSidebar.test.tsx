import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MainSidebar } from '../MainSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

vi.mock('next-auth/react', () => ({
  useSession: vi.fn(),
}));

vi.mock('@/hooks/useMobile', () => ({
  useIsMobile: () => false,
}));

import { useSession } from 'next-auth/react';

const renderWithProviders = (ui: React.ReactElement) => {
  return render(<SidebarProvider>{ui}</SidebarProvider>);
};

describe('MainSidebar', () => {
  beforeEach(() => vi.clearAllMocks());

  it('deve exibir rotas de acesso quando usuário não logado', () => {
    (useSession as any).mockReturnValue({ data: null, status: 'unauthenticated' });
    renderWithProviders(<MainSidebar />);

    expect(screen.getByText(/Início/i)).toBeInTheDocument();
    expect(screen.getByText(/Entrar/i)).toBeInTheDocument();
    expect(screen.getByText(/Cadastro Usuário/i)).toBeInTheDocument();
    expect(screen.getByText(/Cadastro Mentor/i)).toBeInTheDocument();
  });

  it("deve exibir 'Meus Agendamentos' quando usuário logado comum", () => {
    (useSession as any).mockReturnValue({
      data: { user: { id: '1', role: 'user' } },
      status: 'authenticated',
    });
    renderWithProviders(<MainSidebar />);

    expect(screen.getByText(/Meus Agendamentos/i)).toBeInTheDocument();
    expect(screen.queryByText(/Dashboard/i)).not.toBeInTheDocument();
  });

  it('deve exibir seções do mentor quando role for mentor', () => {
    (useSession as any).mockReturnValue({
      data: { user: { id: '1', role: 'mentor' } },
      status: 'authenticated',
    });
    renderWithProviders(<MainSidebar />);

    expect(screen.getByText(/Área do Mentor/i)).toBeInTheDocument();
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/^Agendamentos$/i)).toBeInTheDocument();
  });
});
