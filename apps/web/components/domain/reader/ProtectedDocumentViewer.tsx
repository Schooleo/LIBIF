'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ProtectedDocumentManifestDto } from '@libif/shared';
import { Badge, Button, Card, InlineAlert, Spinner } from '../../ui';
import { fetchDocumentManifest, fetchProtectedPageUrl, updateReadingProgress, type ReadingProgressStateDto } from '../../../lib/api-browser';
import { BookmarkButton } from './BookmarkButton';
import { ReadingProgressTracker } from './ReadingProgressTracker';

export type ProtectedDocumentViewerMode = 'reader' | 'review';

export interface ProtectedDocumentViewerProps {
  documentId: string;
  title: string;
  initialPage?: number;
  totalPages?: number;
  bookmarked?: boolean;
  mode?: ProtectedDocumentViewerMode;
}

const clampPage = (page: number, totalPages: number) => Math.min(Math.max(page, 1), Math.max(totalPages, 1));

export function ProtectedDocumentViewer({
  documentId,
  title,
  initialPage = 1,
  totalPages: propTotalPages,
  bookmarked = false,
  mode = 'reader',
}: ProtectedDocumentViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [manifest, setManifest] = useState<ProtectedDocumentManifestDto | null>(null);
  const [currentPage, setCurrentPage] = useState(Math.max(1, initialPage));
  const [loadingManifest, setLoadingManifest] = useState(true);
  const [loadingPage, setLoadingPage] = useState(false);
  const [manifestError, setManifestError] = useState<string | null>(null);
  const [pageError, setPageError] = useState<string | null>(null);
  const [renderedPage, setRenderedPage] = useState<number | null>(null);
  const [retryAfterSeconds, setRetryAfterSeconds] = useState<number | null>(null);
  const [retryNonce, setRetryNonce] = useState(0);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [persistingPage, setPersistingPage] = useState<number | null>(null);

  const renderRequestRef = useRef(0);
  const desiredPersistPageRef = useRef<number | null>(null);
  const persistLoopActiveRef = useRef(false);
  const latestPersistedPageRef = useRef<number | null>(null);
  const saveStatusTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const totalPages = manifest?.pageCount ?? propTotalPages ?? 1;
  const safeTotalPages = Math.max(totalPages, 1);
  const isReviewMode = mode === 'review';

  const clearSaveStatusTimer = useCallback(() => {
    if (saveStatusTimeoutRef.current) {
      clearTimeout(saveStatusTimeoutRef.current);
      saveStatusTimeoutRef.current = null;
    }
  }, []);

  const setTransientSaveStatus = useCallback(
    (message: string | null) => {
      clearSaveStatusTimer();
      setSaveStatus(message);
      if (message === 'Saved') {
        saveStatusTimeoutRef.current = setTimeout(() => {
          setSaveStatus((prev) => (prev === 'Saved' ? null : prev));
          saveStatusTimeoutRef.current = null;
        }, 2000);
      }
    },
    [clearSaveStatusTimer],
  );

  useEffect(() => () => clearSaveStatusTimer(), [clearSaveStatusTimer]);

  useEffect(() => {
    let isMounted = true;

    async function loadManifest() {
      try {
        setLoadingManifest(true);
        setManifestError(null);
        const data = await fetchDocumentManifest(documentId);
        if (!isMounted) return;
        setManifest(data);
        const clampedInitialPage = clampPage(initialPage, data.pageCount);
        setCurrentPage(clampedInitialPage);
        latestPersistedPageRef.current = clampedInitialPage;
      } catch (err) {
        if (!isMounted) return;
        setManifestError((err as Error).message);
      } finally {
        if (isMounted) {
          setLoadingManifest(false);
        }
      }
    }

    loadManifest();
    return () => {
      isMounted = false;
    };
  }, [documentId, initialPage]);

  useEffect(() => {
    if (!manifest) return;
    let isMounted = true;
    let currentObjectUrl: string | null = null;
    const renderRequestId = ++renderRequestRef.current;

    async function loadPageImage() {
      try {
        setLoadingPage(true);
        setPageError(null);
        setRenderedPage(null);
        setRetryAfterSeconds(null);

        const objectUrl = await fetchProtectedPageUrl(documentId, currentPage);
        currentObjectUrl = objectUrl;

        if (!isMounted || renderRequestId !== renderRequestRef.current) return;

        const img = new Image();
        img.onload = () => {
          if (!isMounted || renderRequestId !== renderRequestRef.current) return;
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
          setRenderedPage(currentPage);
          setLoadingPage(false);
        };
        img.onerror = () => {
          if (!isMounted || renderRequestId !== renderRequestRef.current) return;
          setPageError(`Failed to display rendered image for page ${currentPage}`);
          setLoadingPage(false);
        };
        img.src = objectUrl;
      } catch (err) {
        if (!isMounted || renderRequestId !== renderRequestRef.current) return;
        const errorObj = err as Error & { statusCode?: number; retryAfterSeconds?: number };
        if (errorObj.statusCode === 429) {
          setRetryAfterSeconds(errorObj.retryAfterSeconds || 60);
        }
        setPageError(errorObj.message || `Failed to load page ${currentPage}`);
        setLoadingPage(false);
      }
    }

    loadPageImage();

    return () => {
      isMounted = false;
      if (currentObjectUrl) {
        URL.revokeObjectURL(currentObjectUrl);
      }
    };
  }, [documentId, currentPage, manifest, retryNonce]);

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

  const runPersistLoop = useCallback(async () => {
    if (isReviewMode || persistLoopActiveRef.current || !manifest) return;
    persistLoopActiveRef.current = true;

    try {
      while (desiredPersistPageRef.current !== null) {
        const nextPage = desiredPersistPageRef.current;
        desiredPersistPageRef.current = null;
        setPersistingPage(nextPage);
        setTransientSaveStatus('Saving progress...');
        try {
          const progress: ReadingProgressStateDto = await updateReadingProgress(documentId, nextPage, manifest.pageCount);
          latestPersistedPageRef.current = progress.currentPage;
          setTransientSaveStatus('Saved');
        } catch (err) {
          console.error('Failed to update reading progress:', err);
          if (desiredPersistPageRef.current === null) {
            setTransientSaveStatus('Failed to save progress');
          }
        } finally {
          setPersistingPage((current) => (current === nextPage ? null : current));
        }
      }
    } finally {
      persistLoopActiveRef.current = false;
      if (desiredPersistPageRef.current !== null) {
        void runPersistLoop();
      }
    }
  }, [documentId, isReviewMode, manifest, setTransientSaveStatus]);

  useEffect(() => {
    if (isReviewMode || !manifest) return;
    if (renderedPage === null || renderedPage === latestPersistedPageRef.current) return;
    desiredPersistPageRef.current = renderedPage;
    void runPersistLoop();
  }, [isReviewMode, manifest, renderedPage, runPersistLoop]);

  const handlePageChange = useCallback(
    (requestedPage: number) => {
      const nextPage = clampPage(requestedPage, safeTotalPages);
      setCurrentPage((prev) => (prev === nextPage ? prev : nextPage));
      setRetryNonce(0);
    },
    [safeTotalPages],
  );

  const handleRetry = useCallback(() => {
    setRetryNonce((value) => value + 1);
  }, []);

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
        handlePageChange(safeTotalPages);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, handlePageChange, safeTotalPages]);

  const progressIndicatorLabel = `${isReviewMode ? 'Review position' : 'Reading progress'}: ${Math.min(100, Math.round((currentPage / safeTotalPages) * 100))}%`;
  const viewerLabel = isReviewMode ? 'Review Canvas Viewer' : 'Watermarked Canvas Viewer';

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
            {isReviewMode
              ? 'The review canvas could not be opened for this document.'
              : 'You do not have entitlement to view this document or the document is currently restricted.'}
          </p>
          <div>
            <a className="ui-button ui-button--secondary" href={isReviewMode ? '/admin/approvals' : '/library'}>
              {isReviewMode ? '← Return to approval queue' : '← Return to My Library'}
            </a>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="ui-stack" style={{ gap: '1.25rem' }}>
      <div
        className="reader-header-cluster"
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
            <Badge tone="success">{viewerLabel}</Badge>
          </div>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-secondary, #666)' }}>
            Document ID: <code>{documentId}</code>
          </p>
        </div>

        {!isReviewMode ? (
          <div className="ui-cluster" style={{ alignItems: 'center', gap: '0.5rem' }}>
            <BookmarkButton documentId={documentId} initialBookmarked={bookmarked} />
          </div>
        ) : null}
      </div>

      <ReadingProgressTracker
        currentPage={currentPage}
        totalPages={safeTotalPages}
        saveStatus={isReviewMode ? null : saveStatus}
        saving={!isReviewMode && persistingPage !== null}
        progressLabel={progressIndicatorLabel}
        onPageChange={handlePageChange}
      />

      <span className="ui-sr-only" role="status" aria-live="polite">
        {loadingPage ? `Loading page ${currentPage}` : `Displaying watermarked page ${currentPage} of ${safeTotalPages}`}
      </span>

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
                <Button variant="secondary" onClick={handleRetry} disabled={retryAfterSeconds !== null && retryAfterSeconds > 0}>
                  Retry Loading Page {currentPage}
                </Button>
              </div>
            </div>
          ) : (
            <div
              className="reader-canvas-container"
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
                tabIndex={0}
                className="reader-canvas"
                aria-label={`Page ${currentPage} of ${safeTotalPages}`}
                onContextMenu={(e) => e.preventDefault()}
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
            {isReviewMode
              ? 'Review pages are individually server-watermarked with session and traceable identifiers. Navigation is not saved as reader progress.'
              : 'Pages are individually server-watermarked with session & traceable identifiers. HTML canvas rendering provides controlled page delivery and copy deterrence.'}
          </div>
        </div>
      </Card>
    </div>

  );
}
