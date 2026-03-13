import { useI18n } from '../../contexts/I18nContext';
import type { CardResponse } from '../../types/card';
import { CardRenderer } from '../cards/CardRenderer';

interface ReviewCardProps {
  card: CardResponse;
  showBack: boolean;
  onReveal: () => void;
}

export function ReviewCard({ card, showBack, onReveal }: ReviewCardProps) {
  const { t } = useI18n();

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="rounded-xl border border-line bg-surface p-8 shadow-sm">
        <CardRenderer front={card.front} back={card.back} cardType={card.cardType} hint={card.hint} showBack={showBack} />
        {!showBack && (
          <button
            onClick={onReveal}
            className="mt-6 w-full rounded-lg bg-accent py-3 text-sm font-medium text-white hover:bg-accent-hover"
          >
            {t.review.showAnswer}
          </button>
        )}
      </div>
    </div>
  );
}
