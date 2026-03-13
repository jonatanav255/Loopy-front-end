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
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1 cursor-pointer" onClick={() => setExpanded(!expanded)}>
          <CardRenderer front={card.front} back={card.back} cardType={card.cardType} hint={card.hint} showBack={expanded} />
        </div>
        <div className="ml-4 flex flex-shrink-0 gap-1">
          <button onClick={onEdit} className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600" title="Edit">
            ✎
          </button>
          <button onClick={onDelete} className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600" title="Delete">
            ✕
          </button>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-3 border-t border-gray-100 pt-3">
        <Badge label={card.schedulingAlgorithm} color={card.schedulingAlgorithm === 'FSRS' ? 'indigo' : 'blue'} />
        <span className="text-xs text-gray-400">
          Next: {new Date(card.nextReviewDate).toLocaleDateString()} · Interval: {card.intervalDays}d
        </span>
        <AlgorithmToggle current={card.schedulingAlgorithm} onSwitch={onSwitchAlgorithm} />
      </div>
    </div>
  );
}
