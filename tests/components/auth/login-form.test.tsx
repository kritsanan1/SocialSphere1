import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../utils/test-utils';
import LoginForm from '../../../client/src/components/auth/login-form';

// Mock the auth hook
vi.mock('../../../client/src/hooks/use-auth', () => ({
  useAuth: () => ({
    login: vi.fn(),
    user: null,
    loading: false,
  }),
}));

// Mock the toast hook
vi.mock('../../../client/src/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('LoginForm', () => {
  it('renders login form correctly', () => {
    render(<LoginForm />);

    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByText('Sign in to your account to continue')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
  });

  it('validates email field', async () => {
    render(<LoginForm />);

    const emailInput = screen.getByLabelText('Email');
    const submitButton = screen.getByRole('button', { name: 'Sign In' });

    // Try to submit with invalid email
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid email')).toBeInTheDocument();
    });
  });

  it('validates password field', async () => {
    render(<LoginForm />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign In' });

    // Try to submit with valid email but empty password
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: '' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('String must contain at least 1 character(s)')).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    const mockLogin = vi.fn();
    
    vi.mocked(require('../../../client/src/hooks/use-auth').useAuth).mockReturnValue({
      login: mockLogin,
      user: null,
      loading: false,
    });

    render(<LoginForm />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign In' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('shows loading state during submission', () => {
    vi.mocked(require('../../../client/src/hooks/use-auth').useAuth).mockReturnValue({
      login: vi.fn(),
      user: null,
      loading: true,
    });

    render(<LoginForm />);

    const submitButton = screen.getByRole('button', { name: 'Signing In...' });
    expect(submitButton).toBeDisabled();
  });
});