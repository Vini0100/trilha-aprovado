import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
// Mock Carousel UI to avoid embla internals in tests
vi.mock('@/components/ui/carousel', () => ({
  Carousel: ({ children }: any) => <div data-testid="carousel">{children}</div>,
  CarouselContent: ({ children }: any) => <div data-testid="carousel-content">{children}</div>,
  CarouselItem: ({ children }: any) => <div data-testid="carousel-item">{children}</div>,
}));

// Mock autoplay import safely (even if unused by our stub)
vi.mock('embla-carousel-autoplay', () => ({
  default: () => ({}),
}));

import { MentorshipCarousel } from '../MentorshipCarousel';

describe('MentorshipCarousel', () => {
  it('deve renderizar os itens do carrossel com títulos conhecidos', () => {
    render(<MentorshipCarousel />);

    // Alguns títulos esperados (usar correspondência exata para evitar colisão com descrições)
    expect(screen.getByText(/^OAB - Exame da Ordem$/i)).toBeInTheDocument();
    expect(screen.getByText(/^TCE - Tribunal de Contas$/i)).toBeInTheDocument();
    expect(screen.getByText(/^Magistratura$/i)).toBeInTheDocument();
    expect(screen.getByText(/^Ministério Público$/i)).toBeInTheDocument();
    expect(screen.getByText(/^Defensoria Pública$/i)).toBeInTheDocument();
    expect(screen.getByText(/^Delegacia de Polícia$/i)).toBeInTheDocument();
  });
});
