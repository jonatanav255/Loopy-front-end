// Dependencies: useState, useEffect — see DEPENDENCY_GUIDE.md
import { useState, useEffect } from 'react';
import { statsApi } from '../api/stats';
import type { StatsOverview, TopicAccuracy, HeatmapEntry, FragileCard } from '../types/stats';

export function useStats() {
  const [overview, setOverview] = useState<StatsOverview | null>(null);
  const [accuracy, setAccuracy] = useState<TopicAccuracy[]>([]);
  const [heatmap, setHeatmap] = useState<HeatmapEntry[]>([]);
  const [fragile, setFragile] = useState<FragileCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [ov, acc, hm, fr] = await Promise.all([
          statsApi.overview(),
          statsApi.accuracy(),
          statsApi.heatmap(),
          statsApi.fragile(),
        ]);
        setOverview(ov.data);
        setAccuracy(acc.data);
        setHeatmap(hm.data);
        setFragile(fr.data);
      } catch {
        // Stats may be empty for new users — not critical
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return { overview, accuracy, heatmap, fragile, loading };
}
