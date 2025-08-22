import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../../client/src/hooks/use-auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Mock fetch
global.fetch = vi.fn();

describe('useAuth', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );

  it('should initialize with no user when no token in localStorage', () => {
    mockLocalStorage.getItem.mockReturnValue(null);

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(true);
  });

  it('should initialize with token from localStorage', () => {
    const mockToken = 'test.jwt.token';
    mockLocalStorage.getItem.mockReturnValue(mockToken);

    renderHook(() => useAuth(), { wrapper });

    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('token');
  });

  it('should login successfully', async () => {
    const mockResponse = {
      token: 'new.jwt.token',
      user: {
        id: '1',
        email: 'test@example.com',
        username: 'testuser',
      },
    };

    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    } as Response);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    await waitFor(() => {
      expect(result.current.user).toEqual(mockResponse.user);
    });

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('token', mockResponse.token);
    expect(global.fetch).toHaveBeenCalledWith('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
      }),
    });
  });

  it('should handle login errors', async () => {
    const mockError = { message: 'Invalid credentials' };

    vi.mocked(global.fetch).mockResolvedValue({
      ok: false,
      json: () => Promise.resolve(mockError),
    } as Response);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await expect(
      act(async () => {
        await result.current.login({
          email: 'test@example.com',
          password: 'wrongpassword',
        });
      })
    ).rejects.toThrow('Invalid credentials');
  });

  it('should register successfully', async () => {
    const mockResponse = {
      token: 'new.jwt.token',
      user: {
        id: '1',
        email: 'test@example.com',
        username: 'testuser',
      },
    };

    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    } as Response);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.register({
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      });
    });

    await waitFor(() => {
      expect(result.current.user).toEqual(mockResponse.user);
    });

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('token', mockResponse.token);
  });

  it('should logout successfully', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('token');
  });
});