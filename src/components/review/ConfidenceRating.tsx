const levels = [
  { value: 1, label: 'Low', key: '1', color: 'bg-red-500/20 text-red-300 hover:bg-red-500/30' },
  { value: 2, label: 'Medium', key: '2', color: 'bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30' },
  { value: 3, label: 'High', key: '3', color: 'bg-green-500/20 text-green-300 hover:bg-green-500/30' },
];

interface ConfidenceRatingProps {
  onSelect: (confidence: number) => void;
}

export function ConfidenceRating({ onSelect }: ConfidenceRatingProps) {
  return (
    <div className="mx-auto mt-6 max-w-2xl">
      <p className="mb-3 text-center text-sm text-content-muted">How confident are you? (1-3)</p>
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
