import { render, screen, within } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('next-auth/react', () => ({
  useSession: () => ({ data: { user: { id: 1 } } }),
}));

vi.mock('@/hooks/useMentor', () => ({
  useMentorProfile: () => ({ data: { id: 10 } }),
}));

vi.mock('@/hooks/useEssay', () => ({
  useMentorEssays: () => ({
    data: [
      {
        id: 1,
        title: 'Redação 1',
        studentName: 'Aluno A',
        status: 'pending_payment',
        submittedAt: new Date().toISOString(),
      },
      {
        id: 2,
        title: 'Redação 2',
        studentName: 'Aluno B',
        status: 'aguardando_revisao',
        submittedAt: new Date().toISOString(),
      },
    ],
    isLoading: false,
  }),
}));

import Page from '@/app/mentor/redacoes/page';

describe('RedacoesParaCorrigirPage', () => {
  it('mostra status formatados e o link Corrigir apenas para Aguardando revisão', () => {
    render(<Page />);

    // status formatados
    expect(screen.getByText(/Pagamento pendente/i)).toBeInTheDocument();
    expect(screen.getByText(/Aguardando revisão/i)).toBeInTheDocument();

    const items = screen.getAllByRole('listitem');
    const first = items[0];
    const second = items[1];

    // Primeiro item (pending_payment) não deve ter link
    expect(within(first).queryByRole('link', { name: /Corrigir/i })).not.toBeInTheDocument();

    // Segundo item (aguardando_revisao) deve ter link
    expect(within(second).getByRole('link', { name: /Corrigir/i })).toBeInTheDocument();
  });
});
