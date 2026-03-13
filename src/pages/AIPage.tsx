// Dependencies: useState, useRef — see DEPENDENCY_GUIDE.md
import { useState, useRef } from 'react';
import { useAI } from '../hooks/useAI';
import { useToast } from '../contexts/ToastContext';
import { useI18n } from '../contexts/I18nContext';
import { useKeyboard } from '../hooks/useKeyboard';
import { GenerateCardsPanel } from '../components/ai/GenerateCardsPanel';
import { GeneratedCardPreview } from '../components/ai/GeneratedCardPreview';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import type { GeneratedCard } from '../types/ai';

export function AIPage() {
  const { available, loading, generateCards } = useAI();
  const { addToast } = useToast();
  const { t } = useI18n();
  const [generatedCards, setGeneratedCards] = useState<GeneratedCard[]>([]);
  const [targetConceptId, setTargetConceptId] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  useKeyboard((key: string) => {
    if (key === 'Enter' && generatedCards.length === 0 && formRef.current) {
      formRef.current.requestSubmit();
    }
    if (key === 'Escape' && generatedCards.length > 0) {
      setGeneratedCards([]);
    }
  });

  const handleGenerate = async (conceptId: string, content: string, numCards: number) => {
    try {
      return await generateCards(conceptId, content, numCards);
    } catch {
      addToast(t.ai.generateFailed, 'error');
      return [];
    }
  };

  const handleCardsGenerated = (conceptId: string, cards: GeneratedCard[]) => {
    setTargetConceptId(conceptId);
    setGeneratedCards(cards);
    if (cards.length > 0) addToast(t.ai.generated.replace('{count}', String(cards.length)), 'success');
  };

  if (loading) return <LoadingSpinner className="py-20" />;

  if (!available) {
    return (
      <div>
        <h2 className="mb-3 text-2xl font-semibold text-content">{t.ai.title}</h2>

        <div className="rounded-lg border-2 border-dashed border-line-strong py-12 text-center">
          <h3 className="text-sm font-medium text-content">{t.ai.notConfigured}</h3>
          <p className="mt-1 text-sm text-content-muted">
            {t.ai.notConfiguredDesc}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-3 text-2xl font-semibold text-content">{t.ai.title}</h2>

      {generatedCards.length > 0 ? (
        <GeneratedCardPreview
          conceptId={targetConceptId}
          cards={generatedCards}
          onDone={() => setGeneratedCards([])}
        />
      ) : (
        <GenerateCardsPanel onGenerate={handleGenerate} onCardsGenerated={handleCardsGenerated} formRef={formRef} />
      )}
    </div>
  );
}
