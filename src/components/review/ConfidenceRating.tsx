import { useI18n } from '../../contexts/I18nContext';

interface ConfidenceRatingProps {
  onSelect: (confidence: number) => void;
}

export function ConfidenceRating({ onSelect }: ConfidenceRatingProps) {
  const { t } = useI18n();

  const levels = [
    { value: 1, label: t.review.low, key: '1', color: 'bg-red-500/20 text-red-300 hover:bg-red-500/30' },
    { value: 2, label: t.review.medium, key: '2', color: 'bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30' },
    { value: 3, label: t.review.high, key: '3', color: 'bg-green-500/20 text-green-300 hover:bg-green-500/30' },
  ];

  return (
    <div className="mx-auto mt-6 max-w-2xl">
      <p className="mb-3 text-center text-sm text-content-muted">{t.review.confidence}</p>
      <div className="grid grid-cols-3 gap-3">
        {levels.map(l => (
          <button
            key={l.value}
            onClick={() => onSelect(l.value)}
            className={`rounded-lg px-4 py-4 text-sm font-medium transition-colors ${l.color}`}
          >
            <div className="text-xs opacity-60">{l.key}</div>
            {l.label}
          </button>
        ))}
      </div>
    </div>
  );
}
