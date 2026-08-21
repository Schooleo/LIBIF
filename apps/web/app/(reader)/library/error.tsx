'use client';

import { Button, Card, InlineAlert } from '../../../components/ui';

export default function LibraryError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <Card>
      <div className="ui-stack" style={{ gap: '1rem', padding: '0.5rem' }}>
        <InlineAlert tone="error">
          Something went wrong while loading your personal library: {error.message}
        </InlineAlert>
        <div>
          <Button variant="secondary" onClick={() => reset()}>
            Try Again
          </Button>
        </div>
      </div>
    </Card>
  );
}
