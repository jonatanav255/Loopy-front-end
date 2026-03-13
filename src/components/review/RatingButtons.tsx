const ratings = [
  { value: 0, label: 'Again', key: '1', color: 'bg-red-500/20 text-red-300 hover:bg-red-500/30' },
  { value: 1, label: 'Hard', key: '2', color: 'bg-orange-500/20 text-orange-300 hover:bg-orange-500/30' },
  { value: 2, label: 'Difficult', key: '3', color: 'bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30' },
  { value: 3, label: 'OK', key: '4', color: 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30' },
  { value: 4, label: 'Good', key: '5', color: 'bg-green-500/20 text-green-300 hover:bg-green-500/30' },
  { value: 5, label: 'Easy', key: '6', color: 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30' },
];

interface RatingButtonsProps {
  onRate: (rating: number) => void;
}

export function RatingButtons({ onRate }: RatingButtonsProps) {
  return (
    <div className="mx-auto mt-6 max-w-2xl">
      <p className="mb-3 text-center text-sm text-content-muted">Rate your recall (1-6)</p>
      <div className="grid grid-cols-6 gap-2">
        {ratings.map(r => (
          <button
            key={r.value}
            onClick={() => onRate(r.value)}
            className={`rounded-lg px-2 py-3 text-sm font-medium transition-colors ${r.color}`}
          >
            <div className="text-xs opacity-60">{r.key}</div>
            {r.label}
          </button>
        ))}
      </div>
    </div>
  );
}
