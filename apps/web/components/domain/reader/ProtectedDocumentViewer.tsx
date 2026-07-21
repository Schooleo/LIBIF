'use client';

import { useEffect, useState } from 'react';
import { Badge, Button, Card, InlineAlert, Spinner } from '../../ui';
import { fetchDownloadToken, fetchViewToken } from '../../../lib/api-browser';
import { BookmarkButton } from './BookmarkButton';
import { ReadingProgressTracker } from './ReadingProgressTracker';

export interface ProtectedDocumentViewerProps {
  documentId: string;
  title: string;
  initialPage?: number;
  totalPages?: number;
  bookmarked?: boolean;
}

export function ProtectedDocumentViewer({
  documentId,
  title,
  initialPage = 1,
  totalPages = 100,
  bookmarked = false,
}: ProtectedDocumentViewerProps) {
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadToken() {
      try {
        const res = await fetchViewToken(documentId);
        if (isMounted) {
          setStreamUrl(res.url);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError((err as Error).message);
          setLoading(false);
        }
      }
    }
    loadToken();
    return () => {
      isMounted = false;
    };
  }, [documentId]);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = await fetchDownloadToken(documentId);
      window.open(res.url, '_blank');
    } catch (err) {
      alert(`Download failed: ${(err as Error).message}`);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '320px', gap: '1rem' }}>
          <Spinner />
          <p style={{ color: 'var(--color-text-secondary, #666)', fontSize: '0.95rem' }}>
            Verifying access permissions and acquiring secure stream token...
          </p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <div className="ui-stack" style={{ gap: '1rem', padding: '0.5rem' }}>
          <InlineAlert tone="error">Access Denied: {error}</InlineAlert>
          <p style={{ color: 'var(--color-text-secondary, #414846)' }}>
            You do not have entitlement to view this document or the document is currently restricted.
          </p>
          <div>
            <a className="ui-button ui-button--secondary" href="/library">
              ← Return to My Library
            </a>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="ui-stack" style={{ gap: '1.25rem' }}>
      {/* Header Toolbar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          padding: '1.25rem',
          background: 'var(--color-surface, #ffffff)',
          border: '1px solid var(--color-border, #d9e1de)',
          borderRadius: '8px',
        }}
      >
        <div className="ui-stack" style={{ gap: '0.25rem' }}>
          <div className="ui-cluster" style={{ alignItems: 'center', gap: '0.5rem' }}>
            <h1 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--color-text-primary, #151C27)' }}>{title}</h1>
            <Badge tone="success">Protected Stream</Badge>
          </div>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-secondary, #666)' }}>
            Document ID: <code>{documentId}</code>
          </p>
        </div>

        <div className="ui-cluster" style={{ alignItems: 'center', gap: '0.5rem' }}>
          <BookmarkButton documentId={documentId} initialBookmarked={bookmarked} />
          <Button variant="secondary" onClick={handleDownload} disabled={downloading}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px', marginRight: '4px' }} aria-hidden="true">
              download
            </span>
            {downloading ? 'Preparing Download...' : 'Download PDF'}
          </Button>
        </div>
      </div>

      {/* Progress Tracker Stepper */}
      <ReadingProgressTracker documentId={documentId} initialPage={initialPage} totalPages={totalPages} />

      {/* Document View Canvas Container */}
      <Card>
        <div
          style={{
            minHeight: '650px',
            background: 'var(--color-page-background, #f7f9f8)',
            border: '2px dashed var(--color-border, #d9e1de)',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2.5rem',
            textAlign: 'center',
            gap: '1rem',
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--color-action-primary, #103C35) 0%, var(--color-secondary, #0C6668) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
            }}
            aria-hidden="true"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '42px' }}>
              picture_as_pdf
            </span>
          </div>

          <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--color-text-primary, #151C27)' }}>
            Authorized Reader Stream
          </h2>

          <p style={{ maxWidth: '540px', color: 'var(--color-text-secondary, #414846)', fontSize: '0.9rem', lineHeight: 1.5 }}>
            Secure session token validated. Active stream endpoint:
            <br />
            <code style={{ fontSize: '0.8rem', background: '#eef2f1', padding: '2px 6px', borderRadius: '4px', wordBreak: 'break-all' }}>
              {streamUrl}
            </code>
          </p>

          <div
            style={{
              padding: '0.75rem 1.25rem',
              background: 'var(--color-surface, #ffffff)',
              border: '1px solid var(--color-border, #d9e1de)',
              borderRadius: '6px',
              fontSize: '0.85rem',
              color: 'var(--color-text-secondary, #666)',
            }}
          >
            🔒 Watermarked & DRM protection enabled for authenticated session
          </div>
        </div>
      </Card>
    </div>
  );
}
