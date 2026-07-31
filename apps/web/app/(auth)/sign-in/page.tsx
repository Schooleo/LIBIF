import { PageHeader } from '../../../components/layout';
import { SignInForm } from '../../../components/auth/AuthForms';

export default function SignInPage() {
  return <section className="ui-stack"><PageHeader title="Sign in" description="Use your LIBIF account to continue to the reader catalogue or staff workspace." /><SignInForm /></section>;
}
