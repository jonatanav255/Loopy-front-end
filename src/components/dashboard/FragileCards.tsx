import type { FragileCard } from '../../types/stats';
import { Badge } from '../ui/Badge';

interface FragileCardsProps {
  cards: FragileCard[];
}

export function FragileCards({ cards }: FragileCardsProps) {
  if (cards.length === 0) return null;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <h3 className="mb-4 font-medium text-gray-900">Fragile Cards</h3>
      <p className="mb-3 text-sm text-gray-500">Cards you got right but with low confidence.</p>
      <div className="space-y-2">
        {cards.map(fc => (
          <div key={fc.card.id} className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2">
            <span className="text-sm text-gray-700 line-clamp-1">{fc.card.front}</span>
            <div className="flex items-center gap-2">
              <Badge label={`Confidence: ${fc.lastConfidence}`} color="yellow" />
              <span className="text-xs text-gray-400">{fc.occurrences}x</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
