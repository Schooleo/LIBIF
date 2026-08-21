'use client';

import { useState } from 'react';
import { Card } from '../../ui/surfaces/Card';
import { DescriptionList } from '../../ui/data/DataTable';
import { StatusBadge } from '../../ui/indicators/StatusBadge';
import { DocumentPageSearch } from '../reader/DocumentPageSearch';
import { ProtectedDocumentViewer } from '../reader/ProtectedDocumentViewer';
import type { ApprovalReviewItem } from './ApprovalQueue';
import { ApprovalReviewPanel } from './ApprovalReviewPanel';

export function ApprovalReviewWorkspace({ review }: { review: ApprovalReviewItem }) {
  const [requestedPage, setRequestedPage] = useState(1);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 ui-stack">
        <ProtectedDocumentViewer
          documentId={review.bookId}
          title={review.bookTitle || 'Untitled document'}
          mode="review"
          requestedPage={requestedPage}
          showSearch={false}
        />

        <Card>
          <h2 className="text-lg font-semibold mb-4">Review Information</h2>
          <DescriptionList
            items={[
              { term: 'Document Title', description: <strong>{review.bookTitle || 'Untitled'}</strong> },
              { term: 'Review ID', description: <span className="font-mono">{review.id}</span> },
              { term: 'Book ID', description: <span className="font-mono">{review.bookId}</span> },
              { term: 'Review Round', description: `Round #${review.round ?? 1}` },
              { term: 'Current Status', description: <StatusBadge status={review.status.toLowerCase()} label={review.status} /> },
              { term: 'Reason / Comment', description: review.reason || 'N/A' },
              { term: 'Submitted Date', description: new Date(review.createdAt).toLocaleString() },
              { term: 'Updated Date', description: new Date(review.updatedAt).toLocaleString() }
            ]}
          />
        </Card>
      </div>

      <div className="ui-stack">
        <Card>
          <h2 className="text-lg font-semibold mb-4">Search Document Text</h2>
          <DocumentPageSearch
            documentId={review.bookId}
            onPageSelect={setRequestedPage}
            showResultDetails
          />
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Review Decision</h2>
          <ApprovalReviewPanel
            reviewId={review.id}
            bookId={review.bookId}
            bookTitle={review.bookTitle}
            status={review.status}
          />
        </Card>
      </div>
    </div>
  );
}
