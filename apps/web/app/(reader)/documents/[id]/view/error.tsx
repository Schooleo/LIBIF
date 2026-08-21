'use client';

import { Button, Card, InlineAlert } from '../../../../../components/ui';

export default function DocumentViewError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <Card>
      <div className="ui-stack" style={{ gap: '1rem', padding: '0.5rem' }}>
        <InlineAlert tone="error">
          Failed to load document viewer: {error.message}
        </InlineAlert>
        <div className="ui-cluster">
          <Button variant="secondary" onClick={() => reset()}>
            Try Again
          </Button>
          <a className="ui-button ui-button--secondary" href="/library">
            Return to My Library
          </a>
        </div>
      </div>
    </Card>
  );
}
