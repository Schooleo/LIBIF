import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ForgotPasswordForm, RegisterForm, ResetPasswordForm, SignInForm } from '../components/auth/AuthForms';
import { requestPasswordReset, resetPassword, signIn } from '../lib/api-browser';

vi.mock('../lib/api-browser', () => ({
  registerReader: vi.fn(async () => ({ authenticated: true, user: { role: 'READER', email: 'reader@example.edu' }, permissions: [], strategy: 'persistent-cookie' })),
  signIn: vi.fn(async () => ({ authenticated: true, user: { role: 'READER', email: 'reader@example.edu' }, permissions: [], strategy: 'persistent-cookie' })),
  signOut: vi.fn(async () => ({ message: 'Signed out.' })),
  requestPasswordReset: vi.fn(async () => ({ message: 'If an account exists for that email, a reset link has been sent.' })),
  resetPassword: vi.fn(async () => ({ message: 'Password reset complete.' })),
  lookupIsbn: vi.fn(),
  uploadBookIntake: vi.fn()
}));

describe('auth forms', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('keeps registration disabled until email and matching long passwords are valid', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);
    expect(screen.getByRole('button', { name: /create reader account/i })).toBeDisabled();
    await user.type(screen.getByLabelText(/^email/i), 'reader@example.edu');
    await user.type(screen.getByLabelText(/^password/i), 'short');
    await user.type(screen.getByLabelText(/confirm password/i), 'different');
    expect(screen.getByText(/use at least 12 characters/i)).toBeInTheDocument();
    expect(screen.getByText(/passwords must match/i)).toBeInTheDocument();
  });

  it('renders sign-in API errors without redirecting', async () => {
    vi.mocked(signIn).mockRejectedValueOnce(new Error('Invalid email or password.'));
    const user = userEvent.setup();
    render(<SignInForm />);
    await user.type(screen.getByLabelText(/^email/i), 'reader@example.edu');
    await user.type(screen.getByLabelText(/^password/i), 'wrong password');
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Invalid email or password.'));
  });

  it('shows the uniform forgot-password success message', async () => {
    const user = userEvent.setup();
    render(<ForgotPasswordForm />);
    await user.type(screen.getByLabelText(/^email/i), 'reader@example.edu');
    await user.click(screen.getByRole('button', { name: /send reset link/i }));
    await waitFor(() => expect(requestPasswordReset).toHaveBeenCalledWith({ email: 'reader@example.edu' }));
    expect(screen.getByRole('status')).toHaveTextContent(/if an account exists/i);
  });

  it('submits reset token and renders reset API errors', async () => {
    vi.mocked(resetPassword).mockRejectedValueOnce(new Error('Reset token is invalid or expired.'));
    const user = userEvent.setup();
    render(<ResetPasswordForm initialToken="abcdefghijklmnopqrstuvwxyz123456" />);
    await user.type(screen.getByLabelText(/^new password/i), 'new correct horse battery staple');
    await user.type(screen.getByLabelText(/confirm new password/i), 'new correct horse battery staple');
    await user.click(screen.getByRole('button', { name: /reset password/i }));
    await waitFor(() => expect(resetPassword).toHaveBeenCalledWith({ token: 'abcdefghijklmnopqrstuvwxyz123456', password: 'new correct horse battery staple' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Reset token is invalid or expired.');
  });
});
