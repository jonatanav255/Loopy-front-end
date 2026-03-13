import type { TopicAccuracy } from '../../types/stats';

interface AccuracyChartProps {
  data: TopicAccuracy[];
}

export function AccuracyChart({ data }: AccuracyChartProps) {
  if (data.length === 0) return null;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <h3 className="mb-4 font-medium text-gray-900">Accuracy by Topic</h3>
      <div className="space-y-3">
        {data.map(topic => (
          <div key={topic.topicId}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-gray-700">{topic.topicName}</span>
              <span className="font-medium text-gray-900">{Math.round(topic.accuracy * 100)}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                style={{ width: `${topic.accuracy * 100}%` }}
              />
            </div>
            <p className="mt-0.5 text-xs text-gray-400">{topic.passedReviews}/{topic.totalReviews} reviews</p>
          </div>
        ))}
      </div>
    </div>
  );
}
