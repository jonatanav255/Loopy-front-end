import { useI18n } from '../../contexts/I18nContext';
import type { FragileCard } from '../../types/stats';
import { Badge } from '../ui/Badge';

interface FragileCardsProps {
  cards: FragileCard[];
}

export function FragileCards({ cards }: FragileCardsProps) {
  const { t } = useI18n();

  if (cards.length === 0) return null;

  return (
    <div className="rounded-lg border border-line bg-surface p-5">
      <h3 className="mb-4 font-medium text-content">{t.stats.fragileCards}</h3>
      <p className="mb-3 text-sm text-content-muted">{t.stats.fragileDesc}</p>
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
