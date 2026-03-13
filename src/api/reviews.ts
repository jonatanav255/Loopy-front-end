// Dependencies: api.get, api.post — see DEPENDENCY_GUIDE.md
import api from './client';
import type { CardResponse } from '../types/card';
import type { SubmitReviewRequest, ReviewResponse } from '../types/review';

export const reviewsApi = {
  getDueToday: () =>
    api.get<CardResponse[]>('/reviews/today'),

  submit: (cardId: string, data: SubmitReviewRequest) =>
    api.post<ReviewResponse>(`/reviews/${cardId}`, data),
};
