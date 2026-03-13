// Dependencies: api.get — see DEPENDENCY_GUIDE.md
import api from './client';
import type { StatsOverview, TopicAccuracy, HeatmapEntry, FragileCard } from '../types/stats';

export const statsApi = {
  overview: () =>
    api.get<StatsOverview>('/stats/overview'),

  accuracy: () =>
    api.get<TopicAccuracy[]>('/stats/accuracy'),

  heatmap: () =>
    api.get<HeatmapEntry[]>('/stats/heatmap'),

  fragile: () =>
    api.get<FragileCard[]>('/stats/fragile'),
};
