// Dependencies: Link, useNavigate, useCallback — see DEPENDENCY_GUIDE.md
import { Link, useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { useStats } from '../hooks/useStats';
import { useI18n } from '../contexts/I18nContext';
import { useKeyboard } from '../hooks/useKeyboard';
import { StatsOverview } from '../components/dashboard/StatsOverview';
import { Heatmap } from '../components/dashboard/Heatmap';
import { FragileCards } from '../components/dashboard/FragileCards';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export function DashboardPage() {
  const { overview, heatmap, fragile, loading } = useStats();
  const { t } = useI18n();
  const navigate = useNavigate();

  const handleKeyboard = useCallback((key: string) => {
    if (key === 'Enter' && overview && overview.cardsDueToday > 0) {
      navigate('/review');
    }
  }, [overview, navigate]);

  useKeyboard(handleKeyboard);

  if (loading) return <LoadingSpinner className="py-20" />;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-content">{t.dashboard.title}</h2>
        {overview && overview.cardsDueToday > 0 && (
          <Link
            to="/review"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
          >
            {t.dashboard.reviewCards.replace('{count}', String(overview.cardsDueToday))} <span className="ml-1 text-xs opacity-60">(Enter)</span>
          </Link>
        )}
      </div>

      {overview && <StatsOverview stats={overview} />}

      <div className="mt-6">
        <FragileCards cards={fragile} />
      </div>

      <div className="mt-6">
        <Heatmap data={heatmap} />
      </div>
    </div>
  );
}
