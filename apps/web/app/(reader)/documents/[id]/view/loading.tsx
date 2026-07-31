import { Card, Spinner } from '../../../../../components/ui';

export default function DocumentViewLoading() {
  return (
    <Card>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '350px', gap: '1rem' }}>
        <Spinner />
        <p style={{ color: 'var(--color-text-secondary, #666)', fontSize: '0.95rem' }}>
          Verifying access authorization and initializing document viewer...
        </p>
      </div>
    </Card>
  );
}
