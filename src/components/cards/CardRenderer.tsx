import type { CardType } from '../../types/card';

const typeConfig: Record<CardType, { label: string; description: string; color: string }> = {
  STANDARD: { label: 'Standard', description: 'Classic question and answer flashcard', color: 'bg-blue-500/20 text-blue-300' },
  CODE_OUTPUT: { label: 'Code Output', description: 'Given code, predict what it outputs', color: 'bg-green-500/20 text-green-300' },
  SPOT_THE_BUG: { label: 'Spot the Bug', description: 'Find the error in the code snippet', color: 'bg-red-500/20 text-red-300' },
  FILL_BLANK: { label: 'Fill in the Blank', description: 'Complete the missing part of a statement', color: 'bg-yellow-500/20 text-yellow-300' },
  EXPLAIN_WHEN: { label: 'Explain When', description: 'Explain when or why you would use something', color: 'bg-purple-500/20 text-purple-300' },
  COMPARE: { label: 'Compare', description: 'Compare and contrast two or more concepts', color: 'bg-orange-500/20 text-orange-300' },
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
      <span className="group relative inline-flex items-center gap-1.5">
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${typeConfig[cardType].color}`}>
          {typeConfig[cardType].label}
        </span>
        <span className="inline-flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-surface-active text-[10px] text-content-faint">?</span>
        <span className="invisible absolute bottom-full left-0 z-10 mb-1 w-48 rounded-md bg-surface-hover px-2.5 py-1.5 text-xs text-content-secondary shadow-lg group-hover:visible">
          {typeConfig[cardType].description}
        </span>
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
