import type { StatsOverview as StatsOverviewType } from '../../types/stats';

interface StatsOverviewProps {
  stats: StatsOverviewType;
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const cards = [
    { label: 'Due Today', value: stats.cardsDueToday, color: 'text-indigo-600' },
    { label: 'Reviewed Today', value: stats.cardsReviewedToday, color: 'text-green-600' },
    { label: 'Total Cards', value: stats.totalCards, color: 'text-blue-600' },
    { label: 'Accuracy', value: `${Math.round(stats.accuracyToday * 100)}%`, color: 'text-emerald-600' },
    { label: 'Current Streak', value: `${stats.currentStreak}d`, color: 'text-orange-600' },
    { label: 'Longest Streak', value: `${stats.longestStreak}d`, color: 'text-purple-600' },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {cards.map(c => (
        <div key={c.label} className="rounded-lg border border-gray-200 bg-white p-4">
          <p className={`text-2xl font-bold ${c.color}`}>{c.value}</p>
          <p className="text-xs text-gray-500">{c.label}</p>
        </div>
      ))}
    </div>
  );
}
