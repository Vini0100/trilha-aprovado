import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AppointmentScheduler from '../AppointmentScheduler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock Select UI to a simple context-driven implementation to ease interaction
vi.mock('@/components/ui/select', () => {
  const React = require('react');
  const Ctx = React.createContext({ onValueChange: (v: string) => {} } as any);
  return {
    Select: ({ children, onValueChange }: any) => (
      <Ctx.Provider value={{ onValueChange }}>{children}</Ctx.Provider>
    ),
    SelectTrigger: ({ children }: any) => <button>{children}</button>,
    SelectContent: ({ children }: any) => <div>{children}</div>,
    SelectItem: ({ children, value }: any) => {
      const ctx = React.useContext(Ctx);
      return <button onClick={() => ctx.onValueChange(String(value))}>{children}</button>;
    },
    SelectValue: ({ children }: any) => <span>{children}</span>,
  };
});

const mentorsState = {
  data: [
    {
      id: 7,
      name: 'Prof. Ana',
      subjects: [{ id: 1, name: 'Redação' }],
      schedules: [
        {
          id: 1001,
          day: new Date().toISOString().split('T')[0],
          startTime: '08:00',
          endTime: '9:00',
          status: 'available',
        },
      ],
    },
  ] as any[],
  isLoading: false,
};

vi.mock('@/hooks/useMentor', () => ({
  useMentors: () => mentorsState,
}));

vi.mock('next-auth/react', () => ({ useSession: () => ({ data: { user: { id: '123' } } }) }));

const createMock = vi.fn();
vi.mock('@/hooks/useAppointment', () => ({
  useAppointment: () => ({
    create: createMock,
    qrCode: null,
    paymentAmount: null,
    showSuccess: false,
    successInfo: null,
    reset: vi.fn(),
  }),
}));

const createWrapper = () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
};

describe('AppointmentScheduler', () => {
  beforeEach(() => {
    createMock.mockReset();
  });

  it('deve permitir agendar consulta quando campos estão preenchidos', () => {
    render(<AppointmentScheduler />, { wrapper: createWrapper() });

    // Seleciona a data de hoje no grid
    const todayStr = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    const dateCell = screen.getAllByText(todayStr)[0];
    fireEvent.click(dateCell);

    // Seleciona horário disponível 08:00
    const timeButton = screen.getByRole('button', { name: '08:00' });
    fireEvent.click(timeButton);

    // Seleciona matéria (no mock o conteúdo está visível)
    const subjectItem = screen.getByText(/Redação/i);
    fireEvent.click(subjectItem);

    // Método de contato
    fireEvent.click(screen.getByLabelText(/WhatsApp/i));
    fireEvent.change(screen.getByPlaceholderText(/Digite o número com DDD/i), {
      target: { value: '11999990000' },
    });

    // Botão de agendar
    const agendar = screen.getByRole('button', { name: /AGENDAR CONSULTA/i });
    expect(agendar).toBeEnabled();
    fireEvent.click(agendar);

    expect(createMock).toHaveBeenCalledWith(
      expect.objectContaining({
        studentId: 123,
        mentorId: 7,
        subjectId: 1,
        scheduleId: 1001,
        contactMethod: 'whatsapp',
        contactValue: '11999990000',
      }),
    );
  });

  it('deve exibir estados básicos quando sem mentores ou carregando', () => {
    mentorsState.data = [];
    mentorsState.isLoading = false;
    const { unmount } = render(<AppointmentScheduler />, { wrapper: createWrapper() });
    expect(screen.getByText(/Nenhum mentor encontrado/i)).toBeInTheDocument();

    unmount();

    mentorsState.data = undefined as any;
    mentorsState.isLoading = true;
    render(<AppointmentScheduler />, { wrapper: createWrapper() });
    expect(screen.getByText(/Carregando mentores/i)).toBeInTheDocument();
  });
});
