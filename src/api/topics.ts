// Dependencies: api.get, api.post, api.put, api.delete — see DEPENDENCY_GUIDE.md
import api from './client';
import type { TopicResponse, CreateTopicRequest, UpdateTopicRequest } from '../types/topic';

export const topicsApi = {
  list: () =>
    api.get<TopicResponse[]>('/topics'),

  get: (id: string) =>
    api.get<TopicResponse>(`/topics/${id}`),

  create: (data: CreateTopicRequest) =>
    api.post<TopicResponse>('/topics', data),

  update: (id: string, data: UpdateTopicRequest) =>
    api.put<TopicResponse>(`/topics/${id}`, data),

  delete: (id: string) =>
    api.delete(`/topics/${id}`),
};
