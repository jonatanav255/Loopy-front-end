import type { TokenResponse, UserResponse } from '../../types/auth';
import type { TopicResponse } from '../../types/topic';
import type { ConceptResponse } from '../../types/concept';
import type { CardResponse } from '../../types/card';
import type { ReviewResponse } from '../../types/review';
import type { StatsOverview, HeatmapEntry, FragileCard, TopicAccuracy } from '../../types/stats';

export const mockUser: UserResponse = {
  id: 'user-1',
  email: 'test@example.com',
  role: 'USER',
  createdAt: '2025-01-01T00:00:00Z',
};

export const mockTokens: TokenResponse = {
  accessToken: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiZXhwIjo5OTk5OTk5OTk5fQ.fake',
  refreshToken: 'refresh-token-123',
  expiresIn: 3600,
};

export const mockTopics: TopicResponse[] = [
  {
    id: 'topic-1',
    name: 'JavaScript',
    description: 'Core JS concepts',
    colorHex: '#F59E0B',
    sortOrder: 1,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
    cardCount: 5,
  },
  {
    id: 'topic-2',
    name: 'React',
    description: 'React framework',
    colorHex: '#3B82F6',
    sortOrder: 2,
    createdAt: '2025-01-02T00:00:00Z',
    updatedAt: '2025-01-02T00:00:00Z',
    cardCount: 3,
  },
];

export const mockConcepts: ConceptResponse[] = [
  {
    id: 'concept-1',
    topicId: 'topic-1',
    title: 'Closures',
    notes: 'Functions that capture variables from outer scope',
    referenceExplanation: null,
    status: 'LEARNING',
    sortOrder: 1,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'concept-2',
    topicId: 'topic-1',
    title: 'Promises',
    notes: 'Async programming pattern',
    referenceExplanation: 'A Promise represents an eventual completion or failure of an async operation.',
    status: 'REVIEW',
    sortOrder: 2,
    createdAt: '2025-01-02T00:00:00Z',
    updatedAt: '2025-01-02T00:00:00Z',
  },
];

export const mockCards: CardResponse[] = [
  {
    id: 'card-1',
    conceptId: 'concept-1',
    front: 'What is a closure?',
    back: 'A function that captures variables from its enclosing scope.',
    cardType: 'STANDARD',
    hint: 'Think about scope',
    sourceUrl: null,
    repetitionCount: 2,
    easeFactor: 2.5,
    intervalDays: 4,
    nextReviewDate: '2025-03-13T00:00:00Z',
    lastReviewDate: '2025-03-09T00:00:00Z',
    stability: 4.0,
    difficulty: 0.3,
    schedulingAlgorithm: 'SM2',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-03-09T00:00:00Z',
  },
  {
    id: 'card-2',
    conceptId: 'concept-1',
    front: 'What does this code output?\n```javascript\nlet x = 1;\nfunction foo() { console.log(x); }\nfoo();\n```',
    back: '1',
    cardType: 'CODE_OUTPUT',
    hint: null,
    sourceUrl: 'https://example.com',
    repetitionCount: 0,
    easeFactor: 2.5,
    intervalDays: 1,
    nextReviewDate: '2025-03-13T00:00:00Z',
    lastReviewDate: null,
    stability: 1.0,
    difficulty: 0.5,
    schedulingAlgorithm: 'FSRS',
    createdAt: '2025-01-02T00:00:00Z',
    updatedAt: '2025-01-02T00:00:00Z',
  },
];

export const mockReviewResponse: ReviewResponse = {
  reviewLogId: 'review-1',
  rating: 4,
  responseTimeMs: 5000,
  confidence: 2,
  reviewedAt: '2025-03-13T10:00:00Z',
  updatedCard: {
    ...mockCards[0],
    repetitionCount: 3,
    intervalDays: 10,
    nextReviewDate: '2025-03-23T00:00:00Z',
    lastReviewDate: '2025-03-13T10:00:00Z',
  },
};

export const mockStatsOverview: StatsOverview = {
  cardsDueToday: 5,
  cardsReviewedToday: 3,
  totalCards: 25,
  accuracyToday: 80,
  currentStreak: 7,
  longestStreak: 14,
};

export const mockHeatmap: HeatmapEntry[] = [
  { date: '2025-03-10', count: 5 },
  { date: '2025-03-11', count: 3 },
  { date: '2025-03-12', count: 8 },
  { date: '2025-03-13', count: 2 },
];

export const mockAccuracy: TopicAccuracy[] = [
  { topicId: 'topic-1', topicName: 'JavaScript', totalReviews: 20, passedReviews: 16, accuracy: 80 },
  { topicId: 'topic-2', topicName: 'React', totalReviews: 10, passedReviews: 8, accuracy: 80 },
];

export const mockFragileCards: FragileCard[] = [
  {
    card: mockCards[0],
    lastRating: 1,
    lastConfidence: 1,
    occurrences: 3,
  },
];
