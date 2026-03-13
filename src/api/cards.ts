// Dependencies: api.get, api.post, api.put, api.delete — see DEPENDENCY_GUIDE.md
import api from './client';
import type { CardResponse, CreateCardRequest, UpdateCardRequest, SchedulingAlgorithm } from '../types/card';

export const cardsApi = {
  list: (conceptId: string) =>
    api.get<CardResponse[]>('/cards', { params: { conceptId } }),

  get: (id: string) =>
    api.get<CardResponse>(`/cards/${id}`),

  create: (data: CreateCardRequest) =>
    api.post<CardResponse>('/cards', data),

  update: (id: string, data: UpdateCardRequest) =>
    api.put<CardResponse>(`/cards/${id}`, data),

  delete: (id: string) =>
    api.delete(`/cards/${id}`),

  switchAlgorithm: (id: string, algorithm: SchedulingAlgorithm) =>
    api.put<CardResponse>(`/cards/${id}/algorithm`, null, { params: { algorithm } }),
};
