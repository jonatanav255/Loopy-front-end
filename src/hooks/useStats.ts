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
      // Each call is independent — one failure shouldn't block the others
      const results = await Promise.allSettled([
        statsApi.overview(),
        statsApi.accuracy(),
        statsApi.heatmap(),
        statsApi.fragile(),
      ]);
      if (results[0].status === 'fulfilled') setOverview(results[0].value.data);
      if (results[1].status === 'fulfilled') setAccuracy(results[1].value.data);
      if (results[2].status === 'fulfilled') setHeatmap(results[2].value.data);
      if (results[3].status === 'fulfilled') setFragile(results[3].value.data);
      setLoading(false);
    }
    load();
  }, []);

  return { overview, accuracy, heatmap, fragile, loading };
}
