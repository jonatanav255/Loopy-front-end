// Dependencies: api.get, api.post, api.put, api.delete — see DEPENDENCY_GUIDE.md
import api from './client';
import type { ConceptResponse, CreateConceptRequest, UpdateConceptRequest } from '../types/concept';

export const conceptsApi = {
  list: (topicId: string) =>
    api.get<ConceptResponse[]>('/concepts', { params: { topicId } }),

  get: (id: string) =>
    api.get<ConceptResponse>(`/concepts/${id}`),

  create: (data: CreateConceptRequest) =>
    api.post<ConceptResponse>('/concepts', data),

  update: (id: string, data: UpdateConceptRequest) =>
    api.put<ConceptResponse>(`/concepts/${id}`, data),

  delete: (id: string) =>
    api.delete(`/concepts/${id}`),
};
