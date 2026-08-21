import { PageHeader } from '../../../components/layout';
import { RegisterForm } from '../../../components/auth/AuthForms';

export default function RegisterPage() {
  return <section className="ui-stack"><PageHeader title="Create reader account" description="Register as a reader to save access to the digital library." /><RegisterForm /></section>;
}
