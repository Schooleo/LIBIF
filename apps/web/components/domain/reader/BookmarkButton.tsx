'use client';

import { useState } from 'react';
import { Button } from '../../ui';
import { addBookmark, removeBookmark } from '../../../lib/api-browser';

export interface BookmarkButtonProps {
  documentId: string;
  initialBookmarked?: boolean;
  onToggle?: (isBookmarked: boolean) => void;
  size?: 'sm' | 'md';
}

export function BookmarkButton({
  documentId,
  initialBookmarked = false,
  onToggle,
  size = 'md',
}: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    const nextState = !bookmarked;
    setBookmarked(nextState);
    setLoading(true);
    try {
      if (nextState) {
        await addBookmark(documentId);
      } else {
        await removeBookmark(documentId);
      }
      onToggle?.(nextState);
    } catch (err) {
      // Revert optimistic state on error
      setBookmarked(!nextState);
      console.error('Failed to toggle bookmark:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={bookmarked ? 'primary' : 'secondary'}
      size={size}
      onClick={handleToggle}
      disabled={loading}
      aria-label={bookmarked ? 'Remove bookmark from personal library' : 'Bookmark this document to personal library'}
    >
      <span className="material-symbols-outlined" style={{ fontSize: size === 'sm' ? '16px' : '18px', marginRight: '4px', verticalAlign: 'middle' }} aria-hidden="true">
        {bookmarked ? 'bookmark' : 'bookmark_add'}
      </span>
      {bookmarked ? 'Saved' : 'Bookmark'}
    </Button>
  );
}
