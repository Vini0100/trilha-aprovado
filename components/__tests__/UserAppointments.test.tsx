import type React from 'react';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Mock } from 'vitest';
import UserAppointments from '../UserAppointments';

// Mocks dos módulos usados pelo componente
vi.mock('next-auth/react', () => ({
  useSession: vi.fn(),
}));

vi.mock('@/hooks/useAppointment', () => ({
  useUserAppointments: vi.fn(),
}));

// Helpers para acessar os mocks tipados
import { useSession } from 'next-auth/react';
import { useUserAppointments } from '@/hooks/useAppointment';

const asMock = (fn: any) => fn as unknown as Mock;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('UserAppointments', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve solicitar login quando não há usuário na sessão', () => {
    asMock(useSession).mockReturnValue({ data: null, status: 'unauthenticated' } as any);
    asMock(useUserAppointments).mockReturnValue({ data: undefined, isLoading: false });

    render(<UserAppointments />, { wrapper: createWrapper() });

    expect(screen.getByText(/Faça login para ver seus agendamentos\./i)).toBeInTheDocument();
  });

  it('deve exibir estado de carregamento enquanto busca agendamentos', () => {
    asMock(useSession).mockReturnValue({
      data: { user: { id: '1' } },
      status: 'authenticated',
    } as any);
    asMock(useUserAppointments).mockReturnValue({ data: undefined, isLoading: true });

    render(<UserAppointments />, { wrapper: createWrapper() });

    expect(screen.getByText(/Carregando agendamentos/i)).toBeInTheDocument();
  });

  it('deve exibir mensagem quando não há agendamentos aprovados', () => {
    asMock(useSession).mockReturnValue({
      data: { user: { id: '1' } },
      status: 'authenticated',
    } as any);
    asMock(useUserAppointments).mockReturnValue({ data: [], isLoading: false });

    render(<UserAppointments />, { wrapper: createWrapper() });

    expect(screen.getByText(/Nenhum agendamento aprovado encontrado\./i)).toBeInTheDocument();
  });

  it('deve listar agendamentos aprovados com informações principais', () => {
    asMock(useSession).mockReturnValue({
      data: { user: { id: '42' } },
      status: 'authenticated',
    } as any);
    asMock(useUserAppointments).mockReturnValue({
      data: [
        {
          id: 101,
          mentorName: 'Prof. Maria',
          date: '2025-10-23',
          time: '14:00',
          subjectName: 'Redação',
          contactMethod: 'WhatsApp',
          contactValue: '+55 11 99999-0000',
        },
        {
          id: 102,
          mentorName: 'Prof. João',
          date: '2025-10-24',
          time: '16:30',
          subjectName: 'Português',
          contactMethod: null,
          contactValue: null,
        },
      ],
      isLoading: false,
    });

    render(<UserAppointments />, { wrapper: createWrapper() });

    // Título da página
    expect(screen.getByText(/Meus Agendamentos/i)).toBeInTheDocument();

    // Primeiro card
    expect(screen.getByText('Prof. Maria')).toBeInTheDocument();
    expect(screen.getByText('2025-10-23')).toBeInTheDocument();
    expect(screen.getByText('14:00')).toBeInTheDocument();
    expect(screen.getByText('Redação')).toBeInTheDocument();
    expect(screen.getByText(/Meu contato \(WhatsApp\)/i)).toBeInTheDocument();
    expect(screen.getByText('+55 11 99999-0000')).toBeInTheDocument();

    // Segundo card (sem bloco de contato)
    expect(screen.getByText('Prof. João')).toBeInTheDocument();
    expect(screen.getByText('2025-10-24')).toBeInTheDocument();
    expect(screen.getByText('16:30')).toBeInTheDocument();
    expect(screen.getByText('Português')).toBeInTheDocument();
  });
});
