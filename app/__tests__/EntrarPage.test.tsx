import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LoginPage from '../entrar/page';

vi.mock('next-auth/react', () => ({ signIn: vi.fn() }));
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

import { signIn } from 'next-auth/react';
import { toast } from 'sonner';

describe('Entrar Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve enviar o formulário e chamar signIn com credenciais', async () => {
    (signIn as any).mockResolvedValueOnce({ ok: true });
    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText(/E-mail/i), {
      target: { value: 'user@mail.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Senha/i), { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: /Entrar/i }));

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith('credentials', {
        email: 'user@mail.com',
        password: '123456',
        redirect: false,
      });
      expect(toast.success).toHaveBeenCalled();
    });
  });

  it('deve exibir erro quando signIn retorna erro', async () => {
    (signIn as any).mockResolvedValueOnce({ ok: false, error: 'Invalid' });
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText(/E-mail/i), { target: { value: 'x@y.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Senha/i), { target: { value: 'bad' } });
    fireEvent.click(screen.getByRole('button', { name: /Entrar/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Invalid');
    });
  });
});
