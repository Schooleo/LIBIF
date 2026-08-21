'use client';

import { useState } from 'react';
import { Button, InlineAlert } from '../../ui';
import {
  searchDocumentPages,
  type DocumentPageSearchResponse,
  type DocumentPageSearchResult
} from '../../../lib/api-browser';

interface DocumentPageSearchProps {
  documentId: string;
  onPageSelect: (pageNumber: number) => void;
  showResultDetails?: boolean;
}

export function DocumentPageSearch({
  documentId,
  onPageSelect,
  showResultDetails = false
}: DocumentPageSearchProps) {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<DocumentPageSearchResponse | null>(null);
  const [activeResultIndex, setActiveResultIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const results = response?.results.slice(0, 5) ?? [];
  const activeResult = results[activeResultIndex];

  const selectResult = (index: number, result: DocumentPageSearchResult) => {
    setActiveResultIndex(index);
    onPageSelect(result.pageNumber);
  };

  const moveResult = (direction: -1 | 1) => {
    const nextIndex = activeResultIndex + direction;
    const result = results[nextIndex];
    if (!result) return;
    selectResult(nextIndex, result);
  };

  return (
    <div className="ui-stack gap-3">
      <form
        role="search"
        className="ui-stack gap-2"
        onSubmit={async (event) => {
          event.preventDefault();
          const normalizedQuery = query.trim();
          if (normalizedQuery.length < 2) return;

          setLoading(true);
          setError(null);
          try {
            const nextResponse = await searchDocumentPages(documentId, normalizedQuery);
            setResponse(nextResponse);
            setActiveResultIndex(0);
            const firstResult = nextResponse.results[0];
            if (firstResult) onPageSelect(firstResult.pageNumber);
          } catch (searchError) {
            setResponse(null);
            setError((searchError as Error).message);
          } finally {
            setLoading(false);
          }
        }}
      >
        <label className="text-sm font-medium" htmlFor={`document-search-${documentId}`}>
          Search document text
        </label>
        <div className="flex gap-2">
          <input
            id={`document-search-${documentId}`}
            type="search"
            className="ui-input min-w-0 flex-1"
            value={query}
            minLength={2}
            maxLength={100}
            placeholder="Enter a keyword or phrase"
            onChange={(event) => setQuery(event.target.value)}
          />
          <Button type="submit" size="sm" disabled={loading || query.trim().length < 2}>
            {loading ? 'Searching…' : 'Search'}
          </Button>
        </div>
      </form>

      {error ? <InlineAlert tone="error">{error}</InlineAlert> : null}
      {response && !response.available ? (
        <InlineAlert tone="warning">
          Page-level search is unavailable for this document. Reprocess the active file to generate page text.
        </InlineAlert>
      ) : null}
      {response?.available && results.length === 0 ? (
        <InlineAlert tone="info">No matching pages were found.</InlineAlert>
      ) : null}

      {activeResult ? (
        <div className="ui-stack gap-2">
          <p className="text-sm font-semibold" role="status" aria-live="polite">
            Result {activeResultIndex + 1} of {results.length} · Page {activeResult.pageNumber}
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={activeResultIndex === 0}
              onClick={() => moveResult(-1)}
            >
              Before
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={activeResultIndex >= results.length - 1}
              onClick={() => moveResult(1)}
            >
              Next
            </Button>
          </div>
          {response?.truncated ? (
            <p className="text-xs text-neutral-500">
              Showing the first five of {response.totalPagesWithMatches} matching pages.
            </p>
          ) : null}
        </div>
      ) : null}

      {showResultDetails && results.length > 0 ? (
        <ol className="ui-stack gap-2" aria-label="Document search results">
          {results.map((result, index) => (
            <li key={result.pageNumber}>
              <button
                type="button"
                className={`w-full rounded-md border p-3 text-left ${
                  index === activeResultIndex
                    ? 'border-emerald-700 bg-emerald-50'
                    : 'border-neutral-200 bg-white hover:bg-neutral-50'
                }`}
                aria-current={index === activeResultIndex ? 'true' : undefined}
                onClick={() => selectResult(index, result)}
              >
                <span className="block text-sm font-semibold">
                  Page {result.pageNumber} · {result.matchCount} {result.matchCount === 1 ? 'match' : 'matches'}
                </span>
                {result.snippet ? (
                  <span className="mt-1 block text-xs text-neutral-600">{result.snippet}</span>
                ) : null}
              </button>
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}
