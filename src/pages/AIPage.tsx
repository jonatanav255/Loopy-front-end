// Dependencies: useState — see DEPENDENCY_GUIDE.md
import { useState } from 'react';
import { useAI } from '../hooks/useAI';
import { useToast } from '../contexts/ToastContext';
import { GenerateCardsPanel } from '../components/ai/GenerateCardsPanel';
import { GeneratedCardPreview } from '../components/ai/GeneratedCardPreview';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import type { GeneratedCard } from '../types/ai';

export function AIPage() {
  const { available, loading, generateCards } = useAI();
  const { addToast } = useToast();
  const [generatedCards, setGeneratedCards] = useState<GeneratedCard[]>([]);
  const [targetConceptId, setTargetConceptId] = useState('');

  const handleGenerate = async (conceptId: string, content: string) => {
    try {
      return await generateCards(conceptId, content);
    } catch {
      addToast('Failed to generate cards', 'error');
      return [];
    }
  };

  const handleCardsGenerated = (conceptId: string, cards: GeneratedCard[]) => {
    setTargetConceptId(conceptId);
    setGeneratedCards(cards);
    if (cards.length > 0) addToast(`Generated ${cards.length} cards`, 'success');
  };

  if (loading) return <LoadingSpinner className="py-20" />;

  if (!available) {
    return (
      <div>
        <h2 className="mb-4 text-2xl font-semibold text-gray-900">AI Features</h2>
        <div className="rounded-lg border-2 border-dashed border-gray-300 py-12 text-center">
          <h3 className="text-sm font-medium text-gray-900">AI not configured</h3>
          <p className="mt-1 text-sm text-gray-500">
            The Claude API key has not been configured on the server.
            AI features are unavailable.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-6 text-2xl font-semibold text-gray-900">AI Features</h2>

      {generatedCards.length > 0 ? (
        <GeneratedCardPreview
          conceptId={targetConceptId}
          cards={generatedCards}
          onDone={() => setGeneratedCards([])}
        />
      ) : (
        <GenerateCardsPanel onGenerate={handleGenerate} onCardsGenerated={handleCardsGenerated} />
      )}
    </div>
  );
}
