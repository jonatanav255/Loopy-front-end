// Dependencies: useState, useCallback — see DEPENDENCY_GUIDE.md
import { useState, useCallback } from 'react';
import { searchApi } from '../api/search';
import type { SearchResponse } from '../types/search';

const emptyResults: SearchResponse = { topics: [], concepts: [], cards: [] };

export function useSearch() {
  const [results, setResults] = useState<SearchResponse>(emptyResults);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const search = useCallback(async (q: string) => {
    setQuery(q);
    if (!q.trim()) {
      setResults(emptyResults);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await searchApi.search(q);
      setResults(res.data);
      setError(null);
    } catch {
      setError('Search failed');
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setQuery('');
    setResults(emptyResults);
    setError(null);
  }, []);

  const totalResults = results.topics.length + results.concepts.length + results.cards.length;

  return { results, loading, error, query, search, clear, totalResults };
}
