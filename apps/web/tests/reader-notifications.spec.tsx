import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ReaderNotificationCenter, sanitizeReaderActionHref } from '../components/domain/reader';

describe('sanitizeReaderActionHref', () => {
  it('allows safe reader catalogue and viewer paths', () => {
    expect(sanitizeReaderActionHref('/catalogue', 'doc-1')).toBe('/catalogue');
    expect(sanitizeReaderActionHref('/catalogue/doc-1', 'doc-1')).toBe('/catalogue/doc-1');
    expect(sanitizeReaderActionHref('/documents/doc-1/view', 'doc-1')).toBe('/documents/doc-1/view');
    expect(sanitizeReaderActionHref('/library', 'doc-1')).toBe('/library');
    expect(sanitizeReaderActionHref('/history', 'doc-1')).toBe('/history');
    expect(sanitizeReaderActionHref('/bookmarks', 'doc-1')).toBe('/bookmarks');
  });

  it('blocks and sanitizes administrative routes and external URLs', () => {
    expect(sanitizeReaderActionHref('/admin/processing/job-1', 'doc-1')).toBe('/catalogue/doc-1');
    expect(sanitizeReaderActionHref('/admin/approvals/rev-1', 'doc-1')).toBe('/catalogue/doc-1');
    expect(sanitizeReaderActionHref('https://malicious.com', 'doc-1')).toBe('/catalogue/doc-1');
    expect(sanitizeReaderActionHref('javascript:alert(1)', 'doc-1')).toBe('/catalogue/doc-1');
    expect(sanitizeReaderActionHref(null, 'doc-1')).toBe('/catalogue/doc-1');
    expect(sanitizeReaderActionHref(undefined, undefined)).toBe('/catalogue');
  });
});

describe('ReaderNotificationCenter component', () => {
  it('renders initial notifications and handles unread count', () => {
    const mockNotifications = [
      {
        id: 'ntf-1',
        recipientId: 'user-1',
        type: 'DOCUMENT_PUBLISHED',
        title: 'New Document Available',
        body: 'Document Introduction to CS is now published.',
        payload: { documentId: 'doc-100' },
        actionHref: '/documents/doc-100/view',
        isRead: false,
        createdAt: new Date().toISOString(),
      },
    ];

    render(<ReaderNotificationCenter initialNotifications={mockNotifications} />);

    expect(screen.getByText('Notifications')).toBeInTheDocument();
    expect(screen.getByText('1 new')).toBeInTheDocument();
    expect(screen.getByText('New Document Available')).toBeInTheDocument();
    expect(screen.getByText('Document Introduction to CS is now published.')).toBeInTheDocument();
  });
});
