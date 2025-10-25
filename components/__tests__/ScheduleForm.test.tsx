import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ScheduleForm from '../ScheduleForm';

// Mutable mock state for the hooks
const mockState = {
  createMutate: vi.fn(),
  removeMutate: vi.fn(),
  data: [] as any[],
  isLoading: false,
};

vi.mock('@/hooks/useSchedule', () => ({
  useCreateSchedules: () => ({ mutate: mockState.createMutate }),
  useRemoveSchedules: () => ({ mutate: mockState.removeMutate }),
  useMentorSchedules: () => ({ data: mockState.data, isLoading: mockState.isLoading }),
}));

// Mock toasts to avoid console noise
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

describe('ScheduleForm', () => {
  beforeEach(() => vi.clearAllMocks());

  it('deve exibir estado de carregamento', () => {
    mockState.isLoading = true;
    render(<ScheduleForm mentorId={1} />);
    expect(screen.getByText(/Carregando horários/i)).toBeInTheDocument();
    mockState.isLoading = false;
  });

  it('deve selecionar um horário e confirmar, chamando createSchedules.mutate', () => {
    const createMutate = vi.fn();
    mockState.createMutate = createMutate;
    mockState.removeMutate = vi.fn();
    mockState.data = [];
    mockState.isLoading = false;
    render(<ScheduleForm mentorId={10} />);

    // Seleciona 08:00
    fireEvent.click(screen.getByRole('button', { name: '08:00' }));

    // Confirmar horários
    fireEvent.click(screen.getByRole('button', { name: /Confirmar horários/i }));

    // Espera que tenha sido chamada com 1 item para adicionar (dia de hoje)
    expect(createMutate).toHaveBeenCalled();
    const [payload] = createMutate.mock.calls[0];
    expect(Array.isArray(payload)).toBe(true);
    // day deve ser yyyy-mm-dd
    expect(payload[0]).toEqual(
      expect.objectContaining({
        day: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
        startTime: '08:00',
        endTime: '9:00',
      }),
    );
  });
});
