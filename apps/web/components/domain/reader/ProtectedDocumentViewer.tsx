'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Badge, Button, Card, InlineAlert, Spinner } from '../../ui';
import { fetchDocumentManifest, fetchProtectedPageUrl } from '../../../lib/api-browser';
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
  totalPages: propTotalPages,
  bookmarked = false,
}: ProtectedDocumentViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [manifest, setManifest] = useState<{
    pageCount: number;
    minZoom: number;
    maxZoom: number;
    pages: { pageNumber: number; width: number; height: number }[];
  } | null>(null);

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [loadingManifest, setLoadingManifest] = useState(true);
  const [loadingPage, setLoadingPage] = useState(false);
  const [manifestError, setManifestError] = useState<string | null>(null);
  const [pageError, setPageError] = useState<string | null>(null);
  const [retryAfterSeconds, setRetryAfterSeconds] = useState<number | null>(null);

  const totalPages = manifest?.pageCount ?? propTotalPages ?? 1;

  // Load document manifest
  useEffect(() => {
    let isMounted = true;
    async function loadManifest() {
      try {
        setLoadingManifest(true);
        const data = await fetchDocumentManifest(documentId);
        if (isMounted) {
          setManifest(data);
          if (initialPage > data.pageCount) {
            setCurrentPage(1);
          }
          setLoadingManifest(false);
        }
      } catch (err) {
        if (isMounted) {
          setManifestError((err as Error).message);
          setLoadingManifest(false);
        }
      }
    }
    loadManifest();
    return () => {
      isMounted = false;
    };
  }, [documentId, initialPage]);

  // Load and render current watermarked page image onto canvas
  useEffect(() => {
    if (!manifest) return;
    let isMounted = true;
    let currentObjectUrl: string | null = null;

    async function loadPageImage() {
      try {
        setLoadingPage(true);
        setPageError(null);
        setRetryAfterSeconds(null);

        const objectUrl = await fetchProtectedPageUrl(documentId, currentPage);
        currentObjectUrl = objectUrl;

        if (!isMounted) return;

        const img = new Image();
        img.onload = () => {
          if (!isMounted) return;
          const canvas = canvasRef.current;
          if (canvas) {
            canvas.width = img.naturalWidth || img.width;
            canvas.height = img.naturalHeight || img.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              ctx.drawImage(img, 0, 0);
            }
          }
          setLoadingPage(false);
        };
        img.onerror = () => {
          if (isMounted) {
            setPageError(`Failed to display rendered image for page ${currentPage}`);
            setLoadingPage(false);
          }
        };
        img.src = objectUrl;
      } catch (err) {
        if (isMounted) {
          const errorObj = err as any;
          if (errorObj?.statusCode === 429) {
            setRetryAfterSeconds(errorObj.retryAfterSeconds || 60);
          }
          setPageError(errorObj.message || `Failed to load page ${currentPage}`);
          setLoadingPage(false);
        }
      }
    }

    loadPageImage();

    return () => {
      isMounted = false;
      if (currentObjectUrl) {
        URL.revokeObjectURL(currentObjectUrl);
      }
    };
  }, [documentId, currentPage, manifest]);

  // Countdown timer for rate-limit retry
  useEffect(() => {
    if (retryAfterSeconds === null || retryAfterSeconds <= 0) return;
    const timer = setInterval(() => {
      setRetryAfterSeconds((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [retryAfterSeconds]);

  // Page change handler
  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage < 1 || newPage > totalPages) return;
      setCurrentPage(newPage);
    },
    [totalPages],
  );

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        handlePageChange(currentPage - 1);
      } else if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        handlePageChange(currentPage + 1);
      } else if (e.key === 'Home') {
        e.preventDefault();
        handlePageChange(1);
      } else if (e.key === 'End') {
        e.preventDefault();
        handlePageChange(totalPages);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, totalPages, handlePageChange]);

  if (loadingManifest) {
    return (
      <Card>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '320px', gap: '1rem' }}>
          <Spinner />
          <p style={{ color: 'var(--color-text-secondary, #666)', fontSize: '0.95rem' }}>
            Verifying permissions and building document manifest...
          </p>
        </div>
      </Card>
    );
  }

  if (manifestError) {
    return (
      <Card>
        <div className="ui-stack" style={{ gap: '1rem', padding: '0.5rem' }}>
          <InlineAlert tone="error">Access Denied: {manifestError}</InlineAlert>
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
            <Badge tone="success">Watermarked Canvas Viewer</Badge>
          </div>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-secondary, #666)' }}>
            Document ID: <code>{documentId}</code>
          </p>
        </div>

        <div className="ui-cluster" style={{ alignItems: 'center', gap: '0.5rem' }}>
          <BookmarkButton documentId={documentId} initialBookmarked={bookmarked} />
        </div>
      </div>

      {/* Progress Tracker Navigation */}
      <ReadingProgressTracker
        documentId={documentId}
        initialPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* Document View Canvas Container */}
      <Card>
        <div className="ui-stack" style={{ gap: '1rem' }}>
          {pageError ? (
            <div className="ui-stack" style={{ gap: '1rem', padding: '1rem' }}>
              <InlineAlert tone="error">{pageError}</InlineAlert>
              {retryAfterSeconds !== null ? (
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-secondary, #666)' }}>
                  Rate limit active. Please wait <strong>{retryAfterSeconds}s</strong> before requesting more pages.
                </p>
              ) : null}
              <div>
                <Button
                  variant="secondary"
                  onClick={() => handlePageChange(currentPage)}
                  disabled={retryAfterSeconds !== null && retryAfterSeconds > 0}
                >
                  Retry Loading Page {currentPage}
                </Button>
              </div>
            </div>
          ) : (
            <div
              style={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '600px',
                background: '#f4f6f5',
                borderRadius: '8px',
                overflow: 'auto',
                padding: '1rem',
              }}
            >
              {loadingPage && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(255, 255, 255, 0.7)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    zIndex: 2,
                  }}
                >
                  <Spinner />
                  <span style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary, #666)' }}>
                    Rendering watermarked page {currentPage}...
                  </span>
                </div>
              )}

              <canvas
                ref={canvasRef}
                role="img"
                aria-label={`Page ${currentPage} of ${totalPages}`}
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  borderRadius: '4px',
                  backgroundColor: '#ffffff',
                }}
              />
            </div>
          )}

          {/* Truthful protection disclaimer */}
          <div
            style={{
              padding: '0.75rem 1.25rem',
              background: 'var(--color-surface, #ffffff)',
              border: '1px solid var(--color-border, #d9e1de)',
              borderRadius: '6px',
              fontSize: '0.85rem',
              color: 'var(--color-text-secondary, #666)',
              textAlign: 'center',
            }}
          >
            🔒 Pages are individually server-watermarked with session &amp; traceable identifiers. Canvas rendering provides casual copy deterrence.
          </div>
        </div>
      </Card>
    </div>
  );
}
