'use client';

import { useMemo, useState } from 'react';
import { registerReader, requestPasswordReset, resetPassword, signIn } from '../../lib/api-browser';
import { Button, Card, FormField, InlineAlert, PasswordInput, ResultState, TextInput } from '../ui';

type AuthFormStatus = { tone: 'error' | 'success' | 'info'; message: string };

export function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<AuthFormStatus>();
  const [loading, setLoading] = useState(false);
  const canSubmit = isEmailLike(email) && password.length > 0;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setStatus(undefined);
    try {
      const session = await signIn({ email, password });
      const role = session.user?.role;
      window.location.href = role === 'ADMIN' || role === 'LIBRARIAN' ? '/admin/dashboard' : '/catalogue';
    } catch (error) {
      setStatus({ tone: 'error', message: (error as Error).message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <form className="ui-stack" onSubmit={submit}>
        <FormField label="Email" required error={email && !isEmailLike(email) ? 'Enter a valid email address.' : undefined}>{(props) => <TextInput {...props} type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} />}</FormField>
        <FormField label="Password" required>{(props) => <PasswordInput {...props} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} />}</FormField>
        <Button type="submit" loading={loading} disabled={!canSubmit}>Sign in</Button>
        <p><a href="/forgot-password">Forgot your password?</a> <span aria-hidden="true">·</span> <a href="/register">Create a reader account</a></p>
        {status ? <InlineAlert tone={status.tone}>{status.message}</InlineAlert> : null}
      </form>
    </Card>
  );
}

export function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<AuthFormStatus>();
  const [loading, setLoading] = useState(false);
  const passwordError = password && password.length < 12 ? 'Use at least 12 characters.' : undefined;
  const confirmError = confirmPassword && confirmPassword !== password ? 'Passwords must match.' : undefined;
  const canSubmit = isEmailLike(email) && password.length >= 12 && confirmPassword === password;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setStatus(undefined);
    try {
      await registerReader({ email, password });
      window.location.href = '/catalogue';
    } catch (error) {
      setStatus({ tone: 'error', message: (error as Error).message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <form className="ui-stack" onSubmit={submit}>
        <FormField label="Email" required error={email && !isEmailLike(email) ? 'Enter a valid email address.' : undefined}>{(props) => <TextInput {...props} type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} />}</FormField>
        <FormField label="Password" required description="Use a memorable passphrase of at least 12 characters." error={passwordError}>{(props) => <PasswordInput {...props} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} />}</FormField>
        <FormField label="Confirm password" required error={confirmError}>{(props) => <PasswordInput {...props} autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />}</FormField>
        <Button type="submit" loading={loading} disabled={!canSubmit}>Create reader account</Button>
        <p>Already registered? <a href="/sign-in">Sign in</a>.</p>
        {status ? <InlineAlert tone={status.tone}>{status.message}</InlineAlert> : null}
      </form>
    </Card>
  );
}

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<AuthFormStatus>();
  const [loading, setLoading] = useState(false);
  const canSubmit = isEmailLike(email);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setStatus(undefined);
    try {
      const response = await requestPasswordReset({ email });
      setStatus({ tone: 'success', message: response.message });
    } catch (error) {
      setStatus({ tone: 'error', message: (error as Error).message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <form className="ui-stack" onSubmit={submit}>
        <FormField label="Email" required description="For privacy, the response is the same even if no account exists." error={email && !isEmailLike(email) ? 'Enter a valid email address.' : undefined}>{(props) => <TextInput {...props} type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} />}</FormField>
        <Button type="submit" loading={loading} disabled={!canSubmit}>Send reset link</Button>
        <p><a href="/sign-in">Return to sign in</a></p>
        {status ? <InlineAlert tone={status.tone}>{status.message}</InlineAlert> : null}
      </form>
    </Card>
  );
}

export function ResetPasswordForm({ initialToken = '' }: { initialToken?: string }) {
  const [token, setToken] = useState(initialToken);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<AuthFormStatus>();
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const passwordError = password && password.length < 12 ? 'Use at least 12 characters.' : undefined;
  const confirmError = confirmPassword && confirmPassword !== password ? 'Passwords must match.' : undefined;
  const canSubmit = token.length >= 32 && password.length >= 12 && confirmPassword === password;

  const tokenDescription = useMemo(() => (initialToken ? 'Token loaded from the reset link.' : 'Paste the token from your reset email.'), [initialToken]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setStatus(undefined);
    try {
      await resetPassword({ token, password });
      setCompleted(true);
      window.location.href = '/reset-password/completed';
    } catch (error) {
      setStatus({ tone: 'error', message: (error as Error).message });
    } finally {
      setLoading(false);
    }
  };

  if (completed) {
    return <ResultState title="Password reset complete"><p>You can now sign in with your new password.</p><p><a href="/sign-in">Go to sign in</a></p></ResultState>;
  }

  return (
    <Card>
      <form className="ui-stack" onSubmit={submit}>
        <FormField label="Reset token" required description={tokenDescription} error={token && token.length < 32 ? 'Reset token is too short.' : undefined}>{(props) => <TextInput {...props} value={token} onChange={(event) => setToken(event.target.value)} />}</FormField>
        <FormField label="New password" required description="Use a memorable passphrase of at least 12 characters." error={passwordError}>{(props) => <PasswordInput {...props} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} />}</FormField>
        <FormField label="Confirm new password" required error={confirmError}>{(props) => <PasswordInput {...props} autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />}</FormField>
        <Button type="submit" loading={loading} disabled={!canSubmit}>Reset password</Button>
        {status ? <InlineAlert tone={status.tone}>{status.message}</InlineAlert> : null}
      </form>
    </Card>
  );
}

function isEmailLike(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}
