import type { CardResponse } from './card';

export interface SubmitReviewRequest {
  rating: number;
  responseTimeMs?: number;
  confidence?: number;
}

export interface ReviewResponse {
  reviewLogId: string;
  rating: number;
  responseTimeMs: number | null;
  confidence: number | null;
  reviewedAt: string;
  updatedCard: CardResponse;
}
