import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import MentorRegisterPage from '../cadastro/mentor/page';

const mutate = vi.fn();
vi.mock('@/hooks/useMentor', () => ({ useCadastrarMentor: () => ({ isPending: false, mutate }) }));

// Toggleable mock for subjects loading state
let subjectsLoading = false;
vi.mock('@/hooks/useSubject', () => ({
  useSubjects: () =>
    subjectsLoading
      ? { data: [], isLoading: true }
      : { data: [{ id: 1, name: 'Redação' }], isLoading: false },
}));

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

describe('Cadastro Mentor Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    subjectsLoading = false;
  });

  it('deve enviar dados e chamar mutate com payload transformado', async () => {
    render(<MentorRegisterPage />);

    fireEvent.change(screen.getByPlaceholderText(/Nome completo/i), {
      target: { value: 'Prof Ana' },
    });
    fireEvent.change(screen.getByPlaceholderText(/E-mail/i), { target: { value: 'ana@mail.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Senha/i), { target: { value: '123456' } });
    fireEvent.change(screen.getByPlaceholderText(/Telefone/), { target: { value: '119' } });
    fireEvent.change(screen.getByPlaceholderText(/Uma breve descrição/i), {
      target: { value: 'Biografia longa' },
    });

    // Seleciona a matéria via checkbox
    fireEvent.click(screen.getByLabelText('Redação'));

    fireEvent.click(screen.getByRole('button', { name: /Cadastrar Mentor/i }));

    await waitFor(() => {
      expect(mutate).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Prof Ana',
          email: 'ana@mail.com',
          password: '123456',
          bio: 'Biografia longa',
          phone: '119',
          subjectsIds: [1],
        }),
        expect.any(Object),
      );
    });
  });

  it('deve mostrar loader quando assuntos estiverem carregando', () => {
    subjectsLoading = true;
    render(<MentorRegisterPage />);
    // Quando carregando, a lista de matérias não deve estar presente
    expect(screen.queryByLabelText('Redação')).not.toBeInTheDocument();
  });
});
