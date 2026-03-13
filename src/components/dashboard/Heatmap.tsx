// Dependencies: useMemo — see DEPENDENCY_GUIDE.md
import { useMemo } from 'react';
import type { HeatmapEntry } from '../../types/stats';

interface HeatmapProps {
  data: HeatmapEntry[];
}

export function Heatmap({ data }: HeatmapProps) {
  const { grid, maxCount, months } = useMemo(() => {
    const countMap = new Map(data.map(d => [d.date, d.count]));
    const today = new Date();
    const cells: { date: string; count: number; dayOfWeek: number }[] = [];
    let max = 1;

    // Last 365 days
    for (let i = 364; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const count = countMap.get(dateStr) ?? 0;
      if (count > max) max = count;
      cells.push({ date: dateStr, count, dayOfWeek: d.getDay() });
    }

    // Group into weeks (columns)
    const weeks: typeof cells[] = [];
    let week: typeof cells = [];
    for (const cell of cells) {
      if (cell.dayOfWeek === 0 && week.length > 0) {
        weeks.push(week);
        week = [];
      }
      week.push(cell);
    }
    if (week.length > 0) weeks.push(week);

    // Month labels
    const monthLabels: { label: string; col: number }[] = [];
    let lastMonth = -1;
    weeks.forEach((w, i) => {
      const month = new Date(w[0].date).getMonth();
      if (month !== lastMonth) {
        monthLabels.push({ label: new Date(w[0].date).toLocaleString('default', { month: 'short' }), col: i });
        lastMonth = month;
      }
    });

    return { grid: weeks, maxCount: max, months: monthLabels };
  }, [data]);

  const getColor = (count: number) => {
    if (count === 0) return 'bg-gray-100';
    const intensity = count / maxCount;
    if (intensity <= 0.25) return 'bg-green-200';
    if (intensity <= 0.5) return 'bg-green-400';
    if (intensity <= 0.75) return 'bg-green-500';
    return 'bg-green-700';
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <h3 className="mb-4 font-medium text-gray-900">Activity</h3>
      <div className="overflow-x-auto">
        <div className="mb-1 flex gap-[3px]" style={{ paddingLeft: '16px' }}>
          {months.map(m => (
            <span
              key={m.label + m.col}
              className="text-[10px] text-gray-400"
              style={{ position: 'relative', left: `${m.col * 15}px` }}
            >
              {m.label}
            </span>
          ))}
        </div>
        <div className="flex gap-[3px]">
          {grid.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map(cell => (
                <div
                  key={cell.date}
                  className={`h-3 w-3 rounded-sm ${getColor(cell.count)}`}
                  title={`${cell.date}: ${cell.count} reviews`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
