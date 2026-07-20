'use client';

import { useEffect, useId, useRef, type KeyboardEvent, type ReactNode } from 'react';
import { Button } from '../actions/Button';

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(',');

function useOverlayFocus(open: boolean, onClose?: () => void) {
  const overlayRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return undefined;

    const previousActiveElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusOverlay = () => {
      const overlay = overlayRef.current;
      if (!overlay) return;
      const firstFocusable = overlay.querySelector<HTMLElement>(focusableSelector);
      (firstFocusable ?? overlay).focus();
    };

    focusOverlay();

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape' && onClose) {
        event.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previousActiveElement?.isConnected) previousActiveElement.focus();
    };
  }, [open, onClose]);

  const handleTabKey = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== 'Tab') return;
    const overlay = overlayRef.current;
    if (!overlay) return;

    const focusable = Array.from(overlay.querySelectorAll<HTMLElement>(focusableSelector));
    if (focusable.length === 0) {
      event.preventDefault();
      overlay.focus();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return { overlayRef, handleTabKey };
}

export function Dialog({ open, title, description, children, onClose }: { open: boolean; title: string; description?: string; children: ReactNode; onClose: () => void }) {
  const titleId = useId();
  const descriptionId = useId();
  const { overlayRef, handleTabKey } = useOverlayFocus(open, onClose);

  if (!open) return null;
  return (
    <div className="ui-dialog__backdrop">
      <section
        ref={overlayRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className="ui-dialog__content"
        tabIndex={-1}
        onKeyDown={handleTabKey}
      >
        <h2 id={titleId}>{title}</h2>
        {description ? <p id={descriptionId}>{description}</p> : null}
        {children}
        <Button variant="secondary" onClick={onClose}>Close</Button>
      </section>
    </div>
  );
}

export function ConfirmationDialog(props: Parameters<typeof Dialog>[0]) { return <Dialog {...props} />; }
export function DestructiveDialog(props: Parameters<typeof Dialog>[0]) { return <Dialog {...props} />; }

export function Drawer({ open = true, title, children, onClose }: { open?: boolean; title: string; children: ReactNode; onClose?: () => void }) {
  const titleId = useId();
  const { overlayRef, handleTabKey } = useOverlayFocus(open, onClose);

  if (!open) return null;
  return (
    <aside
      ref={overlayRef}
      className="ui-drawer"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      tabIndex={-1}
      onKeyDown={handleTabKey}
    >
      <h2 id={titleId}>{title}</h2>
      {children}
      {onClose ? <Button variant="secondary" onClick={onClose}>Close drawer</Button> : null}
    </aside>
  );
}
