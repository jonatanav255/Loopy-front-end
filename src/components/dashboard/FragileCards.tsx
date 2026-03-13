import type { FragileCard } from '../../types/stats';
import { Badge } from '../ui/Badge';

interface FragileCardsProps {
  cards: FragileCard[];
}

export function FragileCards({ cards }: FragileCardsProps) {
  if (cards.length === 0) return null;

  return (
    <div className="rounded-lg border border-line bg-surface p-5">
      <h3 className="mb-4 font-medium text-content">Fragile Cards</h3>
      <p className="mb-3 text-sm text-content-muted">Cards you got right but with low confidence.</p>
      <div className="space-y-2">
        {cards.map(fc => (
          <div key={fc.card.id} className="flex items-center justify-between rounded-md bg-surface-alt px-3 py-2">
            <span className="text-sm text-content-secondary line-clamp-1">{fc.card.front}</span>
            <div className="flex items-center gap-2">
              <Badge label={`Confidence: ${fc.lastConfidence}`} color="yellow" />
              <span className="text-xs text-content-faint">{fc.occurrences}x</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
