import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import UserRegisterPage from '../cadastro/usuario/page';

const mutate = vi.fn();
vi.mock('@/hooks/useUser', () => ({ useCadastrarUser: () => ({ isPending: false, mutate }) }));
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

describe('Cadastro Usuário Page', () => {
  beforeEach(() => vi.clearAllMocks());

  it('deve enviar dados e chamar mutate com payload do formulário', async () => {
    render(<UserRegisterPage />);

    fireEvent.change(screen.getByPlaceholderText(/Nome/i), { target: { value: 'Ana' } });
    fireEvent.change(screen.getByPlaceholderText(/E-mail/i), { target: { value: 'ana@mail.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Telefone/i), {
      target: { value: '11999999999' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Senha/i), { target: { value: '123456' } });

    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));

    await waitFor(() => {
      expect(mutate).toHaveBeenCalledWith(
        { name: 'Ana', email: 'ana@mail.com', phone: '11999999999', password: '123456' },
        expect.objectContaining({ onSuccess: expect.any(Function), onError: expect.any(Function) }),
      );
    });
  });
});
