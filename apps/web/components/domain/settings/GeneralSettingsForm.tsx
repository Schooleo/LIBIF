'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import type { GeneralSettingsResponseDto } from '../../../lib/api-types';
import { updateGeneralSettings } from '../../../lib/api-browser';
import {
  Button,
  Card,
  DescriptionList,
  FormField,
  InlineAlert,
  Textarea,
  TextInput,
} from '../../ui';

export function GeneralSettingsForm({ initialSettings }: { initialSettings: GeneralSettingsResponseDto }) {
  const router = useRouter();
  const [settings, setSettings] = useState(initialSettings);
  const [libraryName, setLibraryName] = useState(initialSettings.libraryName);
  const [supportEmail, setSupportEmail] = useState(initialSettings.supportEmail ?? '');
  const [defaultLocale, setDefaultLocale] = useState(initialSettings.defaultLocale);
  const [readerNotice, setReaderNotice] = useState(initialSettings.readerNotice ?? '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ tone: 'success' | 'error'; text: string }>();

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage(undefined);
    try {
      const updated = await updateGeneralSettings({
        libraryName,
        supportEmail: supportEmail.trim() || null,
        defaultLocale,
        readerNotice: readerNotice.trim() || null,
      });
      setSettings(updated);
      setMessage({ tone: 'success', text: 'General settings saved.' });
      router.refresh();
    } catch (error) {
      setMessage({
        tone: 'error',
        text: error instanceof Error ? error.message : 'Unexpected settings error',
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="ui-stack">
      {message ? <InlineAlert tone={message.tone}>{message.text}</InlineAlert> : null}
      <Card>
        <form className="ui-stack" onSubmit={submit}>
          <FormField label="Library name" required>
            {(props) => <TextInput {...props} value={libraryName} onChange={(event) => setLibraryName(event.target.value)} maxLength={120} required />}
          </FormField>
          <FormField label="Support email" description="Optional public support contact.">
            {(props) => <TextInput {...props} type="email" value={supportEmail} onChange={(event) => setSupportEmail(event.target.value)} maxLength={254} />}
          </FormField>
          <FormField label="Default locale" required description="Locale used when a reader has no saved preference.">
            {(props) => <TextInput {...props} value={defaultLocale} onChange={(event) => setDefaultLocale(event.target.value)} maxLength={16} required />}
          </FormField>
          <FormField label="Reader notice" description="Optional truthful notice shown near protected reading experiences.">
            {(props) => <Textarea {...props} value={readerNotice} onChange={(event) => setReaderNotice(event.target.value)} maxLength={500} />}
          </FormField>
          <Button type="submit" loading={saving} disabled={!libraryName.trim() || !defaultLocale.trim()}>
            Save settings
          </Button>
        </form>
      </Card>

      <Card className="ui-stack">
        <h2>Deployment-managed protections</h2>
        <p>These capabilities are read-only here because deployment secrets and enforcement thresholds are not product settings.</p>
        <DescriptionList items={[
          {
            term: 'Watermark signing',
            description: settings.deploymentSecurity.watermarkSigningConfigured ? 'Configured' : 'Not configured; opaque trace fingerprints remain unsigned',
          },
          {
            term: 'Scrape protection',
            description: settings.deploymentSecurity.scrapeProtectionConfigured ? 'Configured' : 'Not configured',
          },
          { term: 'Personalized page cache policy', description: settings.deploymentSecurity.personalizedPageCachePolicy },
          { term: 'Editable here', description: settings.deploymentSecurity.editable ? 'Yes' : 'No' },
        ]} />
        <p className="ui-field__description">
          Last updated <time dateTime={settings.updatedAt}>{formatDateTime(settings.updatedAt)}</time>.
        </p>
      </Card>
    </div>
  );
}

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}
