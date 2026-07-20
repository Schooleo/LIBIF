import { PageHeader } from '../../../components/layout';
import { ResetPasswordForm } from '../../../components/auth/AuthForms';

type ResetPasswordSearchParams = Promise<{ token?: string | string[] }>;

export default async function ResetPasswordPage({ searchParams }: { searchParams: ResetPasswordSearchParams }) {
  const params = await searchParams;
  const token = Array.isArray(params.token) ? params.token[0] : params.token;
  return <section className="ui-stack"><PageHeader title="Choose a new password" description="Use the one-time token from your reset email before it expires." /><ResetPasswordForm initialToken={token ?? ''} /></section>;
}
