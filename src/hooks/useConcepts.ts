// Dependencies: useState, useEffect, useCallback — see DEPENDENCY_GUIDE.md
import { useState, useEffect, useCallback } from 'react';
import { conceptsApi } from '../api/concepts';
import type { ConceptResponse, CreateConceptRequest, UpdateConceptRequest } from '../types/concept';

export function useConcepts(topicId: string | undefined) {
  const [concepts, setConcepts] = useState<ConceptResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConcepts = useCallback(async () => {
    if (!topicId) return;
    try {
      setLoading(true);
      const res = await conceptsApi.list(topicId);
      setConcepts(res.data);
      setError(null);
    } catch {
      setError('Failed to load concepts');
    } finally {
      setLoading(false);
    }
  }, [topicId]);

  useEffect(() => { fetchConcepts(); }, [fetchConcepts]);

  const createConcept = async (data: CreateConceptRequest) => {
    const res = await conceptsApi.create(data);
    setConcepts(prev => [...prev, res.data]);
    return res.data;
  };

  const updateConcept = async (id: string, data: UpdateConceptRequest) => {
    const res = await conceptsApi.update(id, data);
    setConcepts(prev => prev.map(c => c.id === id ? res.data : c));
    return res.data;
  };

  const deleteConcept = async (id: string) => {
    await conceptsApi.delete(id);
    setConcepts(prev => prev.filter(c => c.id !== id));
  };

  const reorderConcepts = async (orderedIds: string[]) => {
    if (!topicId) return;
    // Optimistic update
    setConcepts(prev => {
      const map = new Map(prev.map(c => [c.id, c]));
      return orderedIds.map(id => map.get(id)!).filter(Boolean);
    });
    try {
      const res = await conceptsApi.reorder(topicId, orderedIds);
      setConcepts(res.data);
    } catch {
      // Revert on failure
      await fetchConcepts();
    }
  };

  return { concepts, loading, error, createConcept, updateConcept, deleteConcept, reorderConcepts, refetch: fetchConcepts };
}
