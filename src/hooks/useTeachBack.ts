// Dependencies: useState, useEffect, useCallback — see DEPENDENCY_GUIDE.md
import { useState, useEffect, useCallback } from 'react';
import { teachBackApi } from '../api/teachback';
import type { ConceptResponse } from '../types/concept';
import type { SubmitTeachBackRequest, TeachBackResponse } from '../types/teachback';

export function useTeachBack() {
  const [pending, setPending] = useState<ConceptResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = useCallback(async () => {
    try {
      setLoading(true);
      const res = await teachBackApi.getPending();
      setPending(res.data);
    } catch {
      // May fail if no concepts yet
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPending(); }, [fetchPending]);

  const submit = async (data: SubmitTeachBackRequest) => {
    const res = await teachBackApi.submit(data);
    setPending(prev => prev.filter(c => c.id !== data.conceptId));
    return res.data;
  };

  const getHistory = async (conceptId: string) => {
    const res = await teachBackApi.getHistory(conceptId);
    return res.data as TeachBackResponse[];
  };

  return { pending, loading, submit, getHistory, refetch: fetchPending };
}
