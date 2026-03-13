// Dependencies: useState, useCallback, useEffect, useRef, Link — see DEPENDENCY_GUIDE.md
import { useState, useCallback, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSearch } from '../hooks/useSearch';
import { useI18n } from '../contexts/I18nContext';
import { useKeyboard } from '../hooks/useKeyboard';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { EmptyState } from '../components/ui/EmptyState';

export function SearchPage() {
  const { results, loading, query, search, clear, totalResults } = useSearch();
  const { t } = useI18n();
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Auto-focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Debounced search
  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (!inputValue.trim()) {
      clear();
      return;
    }
    debounceRef.current = setTimeout(() => {
      search(inputValue);
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [inputValue, search, clear]);

  const handleKeyboard = useCallback((key: string) => {
    if (key === 'Escape') {
      if (inputValue) {
        setInputValue('');
      }
    }
    if (key === '/') {
      inputRef.current?.focus();
    }
  }, [inputValue]);

  useKeyboard(handleKeyboard);

  const hasQuery = query.trim().length > 0;

  return (
    <div>
      <div className="mb-3">
        <h2 className="text-2xl font-semibold text-content">{t.search.title}</h2>
      </div>

      {/* Search input */}
      <div className="mb-6">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-content-muted">
            &#x2315;
          </span>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder={t.search.placeholder}
            className="w-full rounded-lg border border-line bg-surface py-3 pl-10 pr-4 text-content placeholder:text-content-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {inputValue && (
            <button
              onClick={() => setInputValue('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-content-muted hover:text-content"
            >
              &#x2715;
            </button>
          )}
        </div>
        <p className="mt-1 text-xs text-content-muted">
          {t.search.hint}
        </p>
      </div>

      {/* Results */}
      {loading && <LoadingSpinner className="py-12" />}

      {!loading && hasQuery && totalResults === 0 && (
        <EmptyState
          title={t.search.noResults}
          description={t.search.noResultsDesc.replace('{query}', query)}
        />
      )}

      {!loading && hasQuery && totalResults > 0 && (
        <div className="space-y-6">
          {/* Topics */}
          {results.topics.length > 0 && (
            <section>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-content-secondary">
                {t.search.topicsSection} ({results.topics.length})
              </h3>
              <div className="space-y-2">
                {results.topics.map(topic => (
                  <Link
                    key={topic.id}
                    to={`/topics/${topic.id}`}
                    className="flex items-center gap-3 rounded-lg border border-line bg-surface p-4 transition-colors hover:bg-surface-hover"
                  >
                    <span
                      className="h-3 w-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: topic.colorHex }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-content">{topic.name}</p>
                      {topic.description && (
                        <p className="truncate text-sm text-content-muted">{topic.description}</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Concepts */}
          {results.concepts.length > 0 && (
            <section>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-content-secondary">
                {t.search.conceptsSection} ({results.concepts.length})
              </h3>
              <div className="space-y-2">
                {results.concepts.map(concept => (
                  <Link
                    key={concept.id}
                    to={`/topics/${concept.topicId}/concepts/${concept.id}`}
                    className="block rounded-lg border border-line bg-surface p-4 transition-colors hover:bg-surface-hover"
                  >
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-content">{concept.title}</p>
                      <span className="rounded-full bg-surface-hover px-2 py-0.5 text-xs text-content-secondary">
                        {concept.status}
                      </span>
                    </div>
                    {concept.notes && (
                      <p className="mt-1 truncate text-sm text-content-muted">{concept.notes}</p>
                    )}
                    <p className="mt-1 text-xs text-content-faint">{concept.topicName}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Cards */}
          {results.cards.length > 0 && (
            <section>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-content-secondary">
                {t.search.cardsSection} ({results.cards.length})
              </h3>
              <div className="space-y-2">
                {results.cards.map(card => (
                  <Link
                    key={card.id}
                    to={`/topics/${card.topicId}/concepts/${card.conceptId}`}
                    className="block rounded-lg border border-line bg-surface p-4 transition-colors hover:bg-surface-hover"
                  >
                    <p className="font-medium text-content">{card.front}</p>
                    <p className="mt-1 truncate text-sm text-content-muted">{card.back}</p>
                    <div className="mt-2 flex items-center gap-2 text-xs text-content-faint">
                      <span>{card.topicName}</span>
                      <span>{'>'}</span>
                      <span>{card.conceptTitle}</span>
                      <span className="rounded-full bg-surface-hover px-2 py-0.5">
                        {card.cardType}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {!loading && !hasQuery && (
        <EmptyState
          title={t.search.startSearching}
          description={t.search.startSearchingDesc}
        />
      )}
    </div>
  );
}
