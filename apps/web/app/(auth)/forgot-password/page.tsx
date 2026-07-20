import { PageHeader } from '../../../components/layout';
import { ForgotPasswordForm } from '../../../components/auth/AuthForms';

export default function ForgotPasswordPage() {
  return <section className="ui-stack"><PageHeader title="Reset your password" description="Request a one-time reset link for your LIBIF account." /><ForgotPasswordForm /></section>;
}
