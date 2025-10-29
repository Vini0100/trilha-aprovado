import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('next-auth/react', () => ({
  useSession: () => ({ data: { user: { id: 1 } } }),
}));

vi.mock('@/hooks/useEssay', () => ({
  useStudentEssays: () => ({
    data: [
      {
        id: 1,
        title: 'Meu Título',
        mentorName: 'Mentor A',
        status: 'pending_payment',
        submittedAt: new Date().toISOString(),
      },
      {
        id: 2,
        title: 'Outro Título',
        mentorName: 'Mentor B',
        status: 'aguardando_revisao',
        submittedAt: new Date().toISOString(),
      },
    ],
    isLoading: false,
  }),
}));

import Page from '@/app/minhas-redacoes/page';

describe('MinhasRedacoesPage', () => {
  it('exibe títulos e status formatados', () => {
    render(<Page />);

    expect(screen.getByText('Meu Título')).toBeInTheDocument();
    expect(screen.getByText('Outro Título')).toBeInTheDocument();

    // status formatados
    expect(screen.getByText(/Pagamento pendente/i)).toBeInTheDocument();
    expect(screen.getByText(/Aguardando revisão/i)).toBeInTheDocument();
  });
});
