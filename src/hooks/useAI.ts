// Dependencies: useState, useEffect — see DEPENDENCY_GUIDE.md
import { useState, useEffect } from 'react';
import { aiApi } from '../api/ai';
import type { GeneratedCard, TeachBackEvaluation } from '../types/ai';

export function useAI() {
  const [available, setAvailable] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    aiApi.status()
      .then(res => setAvailable(res.data.available))
      .catch(() => setAvailable(false))
      .finally(() => setLoading(false));
  }, []);

  const generateCards = async (conceptId: string, content: string, numCards: number) => {
    const res = await aiApi.generateCards({ conceptId, content, numCards });
    return res.data as GeneratedCard[];
  };

  const evaluateTeachBack = async (conceptId: string, userExplanation: string) => {
    const res = await aiApi.evaluateTeachBack({ conceptId, userExplanation });
    return res.data as TeachBackEvaluation;
  };

  return { available, loading, generateCards, evaluateTeachBack };
}
