import type React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserList } from "../user-list";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock do fetch
global.fetch = vi.fn();

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("UserList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve exibir loading inicialmente", () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockImplementation(() => new Promise(() => {}));

    render(<UserList />, { wrapper: createWrapper() });

    // Como não temos data-testid nos Skeleton, vamos procurar por elementos de loading
    expect(screen.getAllByRole("generic")).toHaveLength(38);
  });

  it("deve exibir usuários quando carregados com sucesso", async () => {
    const mockUsers = [
      {
        id: 1,
        name: "João Silva",
        email: "joao@email.com",
        phone: "123-456-7890",
      },
      {
        id: 2,
        name: "Maria Santos",
        email: "maria@email.com",
        phone: "098-765-4321",
      },
    ];

    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUsers,
    } as Response);

    render(<UserList />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText("João Silva")).toBeInTheDocument();
      expect(screen.getByText("Maria Santos")).toBeInTheDocument();
      expect(screen.getByText("joao@email.com")).toBeInTheDocument();
      expect(screen.getByText("maria@email.com")).toBeInTheDocument();
    });
  });

  it("deve exibir erro quando a requisição falha", async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce({
      ok: false,
    } as Response);

    render(<UserList />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText(/Erro ao carregar usuários/)).toBeInTheDocument();
    });
  });
});
