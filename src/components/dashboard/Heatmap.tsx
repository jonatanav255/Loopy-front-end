// Dependencies: useMemo — see DEPENDENCY_GUIDE.md
import { useMemo } from 'react';
import type { HeatmapEntry } from '../../types/stats';

interface HeatmapProps {
  data: HeatmapEntry[];
}

function formatLocalDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function Heatmap({ data }: HeatmapProps) {
  const { grid, maxCount, months, year } = useMemo(() => {
    const countMap = new Map(data.map(d => [d.date, d.count]));
    const today = new Date();
    const yr = today.getFullYear();
    const cells: { date: string; count: number; dayOfWeek: number }[] = [];
    let max = 1;

    // Current year: start from the Sunday on or before Jan 1 through today
    const jan1 = new Date(yr, 0, 1);
    const start = new Date(jan1);
    start.setDate(start.getDate() - start.getDay()); // back to Sunday
    const end = new Date(yr, today.getMonth(), today.getDate());

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = formatLocalDate(d);
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

    // Month labels — only for current year, placed at the week containing the 1st of each month
    const monthLabels: { label: string; col: number }[] = [];
    let lastMonth = -1;
    weeks.forEach((w, i) => {
      for (const cell of w) {
        const d = new Date(cell.date);
        const month = d.getMonth();
        if (d.getFullYear() === yr && month !== lastMonth) {
          monthLabels.push({
            label: d.toLocaleString('default', { month: 'short' }),
            col: i,
          });
          lastMonth = month;
          break;
        }
      }
    });

    return { grid: weeks, maxCount: max, months: monthLabels, year: yr };
  }, [data]);

  const getColor = (count: number) => {
    if (count === 0) return 'bg-surface-active';
    const intensity = count / maxCount;
    if (intensity <= 0.25) return 'bg-green-900';
    if (intensity <= 0.5) return 'bg-green-700';
    if (intensity <= 0.75) return 'bg-green-500';
    return 'bg-green-400';
  };

  const cellSize = 16; // h-4 w-4
  const gap = 4;
  const colWidth = cellSize + gap;

  return (
    <div className="rounded-lg border border-line bg-surface p-5">
      <h3 className="mb-4 font-medium text-content">Activity {year}</h3>
      <div className="overflow-x-auto">
        {/* Month labels positioned absolutely over the grid */}
        <div className="relative mb-1" style={{ height: 16 }}>
          {months.map(m => (
            <span
              key={m.label + m.col}
              className="absolute text-xs text-content-faint"
              style={{ left: m.col * colWidth }}
            >
              {m.label}
            </span>
          ))}
        </div>
        <div className="flex gap-[4px]">
          {grid.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[4px]">
              {week.map(cell => (
                <div
                  key={cell.date}
                  className={`h-4 w-4 rounded-sm ${getColor(cell.count)}`}
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
