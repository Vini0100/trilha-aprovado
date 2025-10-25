import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
// Mock Dropdown UI to avoid Radix open/portal behavior complexity in unit tests
vi.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: any) => <div>{children}</div>,
  DropdownMenuTrigger: ({ children }: any) => (
    <button aria-haspopup="menu">
      {children}
      <span className="sr-only">Alternar tema</span>
    </button>
  ),
  DropdownMenuContent: ({ children }: any) => <div role="menu">{children}</div>,
  DropdownMenuItem: ({ children, onClick }: any) => (
    <button role="menuitem" onClick={onClick}>
      {children}
    </button>
  ),
}));

import { ModeToggle } from '../ModeToggle';

const setTheme = vi.fn();
vi.mock('next-themes', () => ({
  useTheme: () => ({ setTheme }),
}));

// Re-import after mocking to get the mocked setTheme reference
import { useTheme } from 'next-themes';

describe('ModeToggle', () => {
  it('deve abrir o menu e alterar o tema ao clicar nas opções', () => {
    render(<ModeToggle />);

    const claro = screen.getByRole('menuitem', { name: /claro/i });
    const escuro = screen.getByRole('menuitem', { name: /escuro/i });
    const sistema = screen.getByRole('menuitem', { name: /sistema/i });

    fireEvent.click(claro);
    expect(setTheme).toHaveBeenCalledWith('light');
    fireEvent.click(escuro);
    expect(setTheme).toHaveBeenCalledWith('dark');
    fireEvent.click(sistema);
    expect(setTheme).toHaveBeenCalledWith('system');
  });
});
