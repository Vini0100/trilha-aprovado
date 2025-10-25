import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MentorProfileForm from '../MentorProfileForm';

const makeMutationMock = (overrides: Partial<{ isPending: boolean; mutate: any }> = {}) => ({
  isPending: false,
  mutate: vi.fn(),
  ...overrides,
});

describe('MentorProfileForm', () => {
  it('deve preencher e enviar o formulário chamando a mutação com os valores', () => {
    const updateProfile = makeMutationMock();

    render(
      <MentorProfileForm
        profile={{ user: { id: 1, name: '', email: 'x@y.com', phone: '' } as any, bio: '' }}
        updateProfile={updateProfile as any}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText(/Nome/i), { target: { value: 'Maria' } });
    fireEvent.change(screen.getByPlaceholderText(/Telefone/i), { target: { value: '555' } });
    fireEvent.change(screen.getByPlaceholderText(/Sobre você/i), { target: { value: 'bio' } });

    fireEvent.click(screen.getByRole('button', { name: /Atualizar Perfil/i }));

    expect(updateProfile.mutate).toHaveBeenCalledWith(
      { name: 'Maria', phone: '555', bio: 'bio' },
      expect.objectContaining({ onSuccess: expect.any(Function), onError: expect.any(Function) }),
    );
  });

  it('deve desabilitar o botão quando isPending for verdadeiro', () => {
    const updateProfile = makeMutationMock({ isPending: true });

    render(
      <MentorProfileForm
        profile={{ user: { id: 1, name: 'João', email: 'j@y.com', phone: '123' } as any, bio: 'b' }}
        updateProfile={updateProfile as any}
      />,
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent(/Atualizando\.{3}/i);
  });
});
