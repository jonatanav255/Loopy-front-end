// Dependencies: useState — see DEPENDENCY_GUIDE.md
import { useState } from 'react';
import { cardsApi } from '../../api/cards';
import { useToast } from '../../contexts/ToastContext';
import type { GeneratedCard } from '../../types/ai';
import type { CardType } from '../../types/card';

interface GeneratedCardPreviewProps {
  conceptId: string;
  cards: GeneratedCard[];
  onDone: () => void;
}

export function GeneratedCardPreview({ conceptId, cards, onDone }: GeneratedCardPreviewProps) {
  const { addToast } = useToast();
  const [saved, setSaved] = useState<Set<number>>(new Set());
  const [saving, setSaving] = useState<number | null>(null);

  const handleSave = async (card: GeneratedCard, index: number) => {
    setSaving(index);
    try {
      await cardsApi.create({
        conceptId,
        front: card.front,
        back: card.back,
        cardType: card.cardType as CardType,
        hint: card.hint ?? undefined,
      });
      setSaved(prev => new Set(prev).add(index));
      addToast('Card saved', 'success');
    } catch {
      addToast('Failed to save card', 'error');
    } finally {
      setSaving(null);
    }
  };

  const handleSaveAll = async () => {
    for (let i = 0; i < cards.length; i++) {
      if (!saved.has(i)) {
        await handleSave(cards[i], i);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-900">Generated Cards ({cards.length})</h3>
        <div className="flex gap-3">
          <button
            onClick={handleSaveAll}
            className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
          >
            Save All
          </button>
          <button
            onClick={onDone}
            className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Done
          </button>
        </div>
      </div>

      {cards.map((card, i) => (
        <div key={i} className={`rounded-lg border bg-white p-4 ${saved.has(i) ? 'border-green-300 bg-green-50' : 'border-gray-200'}`}>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-gray-400">{card.cardType}</span>
            {saved.has(i) ? (
              <span className="text-xs font-medium text-green-600">Saved</span>
            ) : (
              <button
                onClick={() => handleSave(card, i)}
                disabled={saving === i}
                className="text-xs font-medium text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
              >
                {saving === i ? 'Saving...' : 'Save'}
              </button>
            )}
          </div>
          <p className="text-sm font-medium text-gray-900">{card.front}</p>
          <p className="mt-2 text-sm text-gray-600">{card.back}</p>
          {card.hint && <p className="mt-1 text-xs italic text-gray-400">Hint: {card.hint}</p>}
        </div>
      ))}
    </div>
  );
}
