import type { CardResponse } from './card';

export interface StatsOverview {
  cardsDueToday: number;
  cardsReviewedToday: number;
  totalCards: number;
  accuracyToday: number;
  currentStreak: number;
  longestStreak: number;
}

export interface TopicAccuracy {
  topicId: string;
  topicName: string;
  totalReviews: number;
  passedReviews: number;
  accuracy: number;
}

export interface HeatmapEntry {
  date: string | number[];
  count: number;
}

export interface FragileCard {
  card: CardResponse;
  lastRating: number;
  lastConfidence: number;
  occurrences: number;
}
