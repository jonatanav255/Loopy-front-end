import { useI18n } from '../../contexts/I18nContext';
import type { TopicAccuracy } from '../../types/stats';

interface AccuracyChartProps {
  data: TopicAccuracy[];
}

export function AccuracyChart({ data }: AccuracyChartProps) {
  const { t } = useI18n();
  if (data.length === 0) return null;

  return (
    <div className="rounded-lg border border-line bg-surface p-5">
      <h3 className="mb-4 font-medium text-content">{t.stats.accuracyByTopic}</h3>
      <div className="space-y-3">
        {data.map(topic => (
          <div key={topic.topicId}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-content-secondary">{topic.topicName}</span>
              <span className="font-medium text-content">{Math.round(topic.accuracy)}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-surface-active">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${topic.accuracy}%` }}
              />
            </div>
            <p className="mt-0.5 text-xs text-content-faint">{topic.passedReviews}/{topic.totalReviews} {t.stats.reviews}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
