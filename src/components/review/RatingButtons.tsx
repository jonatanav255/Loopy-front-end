const ratings = [
  { value: 0, label: 'Again', key: '1', color: 'bg-red-100 text-red-700 hover:bg-red-200' },
  { value: 1, label: 'Hard', key: '2', color: 'bg-orange-100 text-orange-700 hover:bg-orange-200' },
  { value: 2, label: 'Difficult', key: '3', color: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' },
  { value: 3, label: 'OK', key: '4', color: 'bg-blue-100 text-blue-700 hover:bg-blue-200' },
  { value: 4, label: 'Good', key: '5', color: 'bg-green-100 text-green-700 hover:bg-green-200' },
  { value: 5, label: 'Easy', key: '6', color: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' },
];

interface RatingButtonsProps {
  onRate: (rating: number) => void;
}

export function RatingButtons({ onRate }: RatingButtonsProps) {
  return (
    <div className="mx-auto mt-6 max-w-2xl">
      <p className="mb-3 text-center text-sm text-gray-500">Rate your recall (1-6)</p>
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
