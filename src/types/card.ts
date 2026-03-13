export type CardType = 'STANDARD' | 'CODE_OUTPUT' | 'SPOT_THE_BUG' | 'FILL_BLANK' | 'EXPLAIN_WHEN' | 'COMPARE';
export type SchedulingAlgorithm = 'SM2' | 'FSRS';

export interface CardResponse {
  id: string;
  conceptId: string;
  front: string;
  back: string;
  cardType: CardType;
  hint: string | null;
  sourceUrl: string | null;
  repetitionCount: number;
  easeFactor: number;
  intervalDays: number;
  nextReviewDate: string;
  lastReviewDate: string | null;
  stability: number;
  difficulty: number;
  schedulingAlgorithm: SchedulingAlgorithm;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCardRequest {
  conceptId: string;
  front: string;
  back: string;
  cardType: CardType;
  hint?: string;
  sourceUrl?: string;
}

export interface UpdateCardRequest {
  front: string;
  back: string;
  cardType: CardType;
  hint?: string;
  sourceUrl?: string;
}
