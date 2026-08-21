import { PageHeader } from '../../../../../components/layout';
import { GeneralSettingsForm } from '../../../../../components/domain/settings';
import { InlineAlert } from '../../../../../components/ui';
import { fetchGeneralSettings } from '../../../../../lib/api-server';
import { requireAdmin } from '../../../../../lib/auth/require-admin';

export default async function AdminGeneralSettingsPage() {
  await requireAdmin();
  const settings = await fetchGeneralSettings().catch((error: Error) => error);

  return (
    <section className="ui-stack">
      <PageHeader title="General Settings" description="Product-owned library settings with read-only deployment security capability metadata." />
      {settings instanceof Error
        ? <InlineAlert tone="error">General settings could not be loaded: {settings.message}</InlineAlert>
        : <GeneralSettingsForm initialSettings={settings} />}
    </section>
  );
}
