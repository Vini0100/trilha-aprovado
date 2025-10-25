import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Home from '../page';

vi.mock('@/components/MentorshipCarousel', () => ({
  MentorshipCarousel: () => <div>Mock Carousel</div>,
}));
vi.mock('@/components/AppointmentScheduler', () => ({ default: () => <div>Mock Scheduler</div> }));

describe('Home Page', () => {
  it('deve exibir o título e os componentes principais', () => {
    render(<Home />);
    expect(screen.getByText(/Mentoria online/i)).toBeInTheDocument();
    expect(screen.getByText(/Mock Carousel/i)).toBeInTheDocument();
    expect(screen.getByText(/Mock Scheduler/i)).toBeInTheDocument();
  });
});
