// Dependencies: useState — see DEPENDENCY_GUIDE.md
import { useState } from 'react';
import type { CardResponse } from '../../types/card';
import { CardRenderer } from './CardRenderer';
import { AlgorithmToggle } from './AlgorithmToggle';
import { Badge } from '../ui/Badge';
import type { SchedulingAlgorithm } from '../../types/card';

interface CardItemProps {
  card: CardResponse;
  onEdit: () => void;
  onDelete: () => void;
  onSwitchAlgorithm: (algorithm: SchedulingAlgorithm) => Promise<void>;
}

export function CardItem({ card, onEdit, onDelete, onSwitchAlgorithm }: CardItemProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-lg border border-line bg-surface p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1 cursor-pointer" onClick={() => setExpanded(!expanded)}>
          <CardRenderer front={card.front} back={card.back} cardType={card.cardType} hint={card.hint} showBack={expanded} />
        </div>
        <div className="ml-4 flex flex-shrink-0 gap-1">
          <button onClick={onEdit} className="rounded p-1 text-content-secondary hover:bg-surface-hover hover:text-content" title="Edit">
            ✎
          </button>
          <button onClick={onDelete} className="rounded p-1 text-content-secondary hover:bg-red-500/10 hover:text-red-400" title="Delete">
            ✕
          </button>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-3 border-t border-line-subtle pt-3">
        <Badge label={card.schedulingAlgorithm} color={card.schedulingAlgorithm === 'FSRS' ? 'teal' : 'cyan'} />
        <span className="text-xs text-content-faint">
          Next: {new Date(card.nextReviewDate).toLocaleDateString()} · Interval: {card.intervalDays}d
        </span>
        <AlgorithmToggle current={card.schedulingAlgorithm} onSwitch={onSwitchAlgorithm} />
      </div>
    </div>
  );
}
