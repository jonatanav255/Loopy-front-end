import type { StatsOverview as StatsOverviewType } from '../../types/stats';

interface StatsOverviewProps {
  stats: StatsOverviewType;
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const cards = [
    { label: 'Due Today', value: stats.cardsDueToday, color: 'text-indigo-400' },
    { label: 'Reviewed Today', value: stats.cardsReviewedToday, color: 'text-green-400' },
    { label: 'Total Cards', value: stats.totalCards, color: 'text-blue-400' },
    { label: 'Accuracy', value: `${Math.round(stats.accuracyToday)}%`, color: 'text-emerald-400' },
    { label: 'Current Streak', value: `${stats.currentStreak}d`, color: 'text-orange-400' },
    { label: 'Longest Streak', value: `${stats.longestStreak}d`, color: 'text-purple-400' },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {cards.map(c => (
        <div key={c.label} className="rounded-lg border border-line bg-surface p-4">
          <p className={`text-2xl font-bold ${c.color}`}>{c.value}</p>
          <p className="text-xs text-content-secondary">{c.label}</p>
        </div>
      ))}
    </div>
  );
}
