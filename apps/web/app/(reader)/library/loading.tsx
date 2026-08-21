import { Card, Spinner } from '../../../components/ui';

export default function LibraryLoading() {
  return (
    <Card>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', gap: '1rem' }}>
        <Spinner />
        <p style={{ color: 'var(--color-text-secondary, #666)', fontSize: '0.95rem' }}>
          Loading your personal library...
        </p>
      </div>
    </Card>
  );
}
