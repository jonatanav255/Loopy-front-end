// Dependencies: api.get, api.post — see DEPENDENCY_GUIDE.md
import api from './client';
import type { ExportResponse, ImportRequest, ImportResponse } from '../types/dataport';

export const dataportApi = {
  export: (topicIds?: string[]) =>
    api.get<ExportResponse>('/dataport/export', {
      params: topicIds?.length ? { topicIds: topicIds.join(',') } : undefined,
    }),

  import: (data: ImportRequest) =>
    api.post<ImportResponse>('/dataport/import', data),
};
