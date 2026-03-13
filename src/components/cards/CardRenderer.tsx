import type { CardType } from '../../types/card';

const typeLabel: Record<CardType, string> = {
  STANDARD: 'Standard',
  CODE_OUTPUT: 'Code Output',
  SPOT_THE_BUG: 'Spot the Bug',
  FILL_BLANK: 'Fill in the Blank',
  EXPLAIN_WHEN: 'Explain When',
  COMPARE: 'Compare',
};

interface CardRendererProps {
  front: string;
  back?: string;
  cardType: CardType;
  hint?: string | null;
  showBack?: boolean;
}

export function CardRenderer({ front, back, cardType, hint, showBack = false }: CardRendererProps) {
  const isCode = cardType === 'CODE_OUTPUT' || cardType === 'SPOT_THE_BUG';

  return (
    <div>
      <span className="text-xs font-medium uppercase tracking-wider text-content-faint">
        {typeLabel[cardType]}
      </span>
      <div className={`mt-2 ${isCode ? 'whitespace-pre-wrap rounded-md bg-gray-900 p-4 font-mono text-sm text-green-400' : 'text-content'}`}>
        {front}
      </div>
      {hint && !showBack && (
        <p className="mt-2 text-sm italic text-content-faint">Hint: {hint}</p>
      )}
      {showBack && back && (
        <div className="mt-4 border-t border-line pt-4">
          <span className="text-xs font-medium uppercase tracking-wider text-content-faint">Answer</span>
          <div className={`mt-2 ${isCode ? 'whitespace-pre-wrap rounded-md bg-gray-900 p-4 font-mono text-sm text-green-400' : 'text-content'}`}>
            {back}
          </div>
        </div>
      )}
    </div>
  );
}
