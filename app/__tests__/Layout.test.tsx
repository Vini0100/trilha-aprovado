import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

// Mock next/font to avoid calling real font loader
vi.mock('next/font/google', () => ({
  Inter: () => ({ className: 'font-inter' }),
}));

// Provide window.matchMedia for libraries that rely on it (e.g., sonner)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock heavy providers and nested components to simple pass-throughs/markers
vi.mock('@/providers/QueryProvider', () => ({
  QueryProvider: ({ children }: any) => <>{children}</>,
}));
vi.mock('@/providers/ThemeProvider', () => ({
  ThemeProvider: ({ children }: any) => <>{children}</>,
}));
vi.mock('@/providers/SessionProvider', () => ({
  AuthProvider: ({ children }: any) => <>{children}</>,
}));
vi.mock('@/components/ui/sidebar', () => ({
  SidebarProvider: ({ children }: any) => <div data-testid="sidebar-provider">{children}</div>,
  SidebarInset: ({ children }: any) => <div data-testid="sidebar-inset">{children}</div>,
  SidebarTrigger: ({ children }: any) => <button>{children}</button>,
}));
vi.mock('@/components/Header', () => ({ Header: () => <div data-testid="header">Header</div> }));
vi.mock('@/components/MainSidebar', () => ({
  MainSidebar: () => <aside data-testid="main-sidebar">Sidebar</aside>,
}));

describe('RootLayout', () => {
  it('deve renderizar children dentro do main e incluir Header e Sidebar', async () => {
    const { default: RootLayout } = await import('../layout');

    render(
      // RootLayout is a React component that accepts children
      // eslint-disable-next-line react/no-children-prop
      // @ts-ignore
      <RootLayout children={<div>Conteúdo de Teste</div>} />,
    );

    expect(screen.getByText('Conteúdo de Teste')).toBeInTheDocument();
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('main-sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-inset')).toBeInTheDocument();
  });
});
