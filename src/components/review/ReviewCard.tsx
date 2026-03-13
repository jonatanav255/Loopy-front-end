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
      <div className="flip-card rounded-xl border border-line bg-surface p-8 shadow-sm">
        <div className={`flip-card-inner${showBack ? ' flipped' : ''}`}>
          <div className="flip-card-face">
            <CardRenderer front={card.front} cardType={card.cardType} hint={card.hint} showBack={false} />
          </div>
          <div className="flip-card-face flip-card-back">
            <CardRenderer front={card.front} back={card.back} cardType={card.cardType} hint={card.hint} showBack={true} />
          </div>
        </div>
      </div>
      {!showBack && (
        <button
          onClick={onReveal}
          className="mt-6 w-full rounded-lg bg-primary py-3 text-sm font-medium text-white hover:bg-primary-hover"
        >
          {t.review.showAnswer}
        </button>
      )}
    </div>
  );
}
