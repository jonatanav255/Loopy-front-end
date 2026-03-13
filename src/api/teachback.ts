// Dependencies: api.get, api.post — see DEPENDENCY_GUIDE.md
import api from './client';
import type { ConceptResponse } from '../types/concept';
import type { SubmitTeachBackRequest, TeachBackResponse } from '../types/teachback';

export const teachBackApi = {
  getPending: () =>
    api.get<ConceptResponse[]>('/teach-back/pending'),

  submit: (data: SubmitTeachBackRequest) =>
    api.post<TeachBackResponse>('/teach-back', data),

  getHistory: (conceptId: string) =>
    api.get<TeachBackResponse[]>('/teach-back/history', { params: { conceptId } }),
};
