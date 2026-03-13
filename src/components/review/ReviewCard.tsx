import type { CardResponse } from '../../types/card';
import { CardRenderer } from '../cards/CardRenderer';

interface ReviewCardProps {
  card: CardResponse;
  showBack: boolean;
  onReveal: () => void;
}

export function ReviewCard({ card, showBack, onReveal }: ReviewCardProps) {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <CardRenderer front={card.front} back={card.back} cardType={card.cardType} hint={card.hint} showBack={showBack} />
        {!showBack && (
          <button
            onClick={onReveal}
            className="mt-6 w-full rounded-lg bg-indigo-600 py-3 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Show Answer (Space)
          </button>
        )}
      </div>
    </div>
  );
}
