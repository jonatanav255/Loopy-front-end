// Dependencies: api.get — see DEPENDENCY_GUIDE.md
import api from './client';
import type { SearchResponse } from '../types/search';

export const searchApi = {
  search: (query: string) =>
    api.get<SearchResponse>('/search', { params: { q: query } }),
};
