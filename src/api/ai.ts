// Dependencies: api.get, api.post — see DEPENDENCY_GUIDE.md
import api from './client';
import type { AIStatusResponse, GenerateCardsRequest, GeneratedCard, EvaluateTeachBackRequest, TeachBackEvaluation } from '../types/ai';

export const aiApi = {
  status: () =>
    api.get<AIStatusResponse>('/ai/status'),

  generateCards: (data: GenerateCardsRequest) =>
    api.post<GeneratedCard[]>('/ai/generate-cards', data),

  evaluateTeachBack: (data: EvaluateTeachBackRequest) =>
    api.post<TeachBackEvaluation>('/ai/evaluate-teach-back', data),
};
