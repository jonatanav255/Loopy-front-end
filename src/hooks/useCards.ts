// Dependencies: useState, useEffect, useCallback — see DEPENDENCY_GUIDE.md
import { useState, useEffect, useCallback } from 'react';
import { cardsApi } from '../api/cards';
import type { CardResponse, CreateCardRequest, UpdateCardRequest, SchedulingAlgorithm } from '../types/card';

export function useCards(conceptId: string | undefined) {
  const [cards, setCards] = useState<CardResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCards = useCallback(async () => {
    if (!conceptId) return;
    try {
      setLoading(true);
      const res = await cardsApi.list(conceptId);
      setCards(res.data);
      setError(null);
    } catch {
      setError('Failed to load cards');
    } finally {
      setLoading(false);
    }
  }, [conceptId]);

  useEffect(() => { fetchCards(); }, [fetchCards]);

  const createCard = async (data: CreateCardRequest) => {
    const res = await cardsApi.create(data);
    setCards(prev => [...prev, res.data]);
    return res.data;
  };

  const updateCard = async (id: string, data: UpdateCardRequest) => {
    const res = await cardsApi.update(id, data);
    setCards(prev => prev.map(c => c.id === id ? res.data : c));
    return res.data;
  };

  const deleteCard = async (id: string) => {
    await cardsApi.delete(id);
    setCards(prev => prev.filter(c => c.id !== id));
  };

  const switchAlgorithm = async (id: string, algorithm: SchedulingAlgorithm) => {
    const res = await cardsApi.switchAlgorithm(id, algorithm);
    setCards(prev => prev.map(c => c.id === id ? res.data : c));
    return res.data;
  };

  return { cards, loading, error, createCard, updateCard, deleteCard, switchAlgorithm, refetch: fetchCards };
}
