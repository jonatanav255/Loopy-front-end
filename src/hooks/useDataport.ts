// Dependencies: useState, useCallback — see DEPENDENCY_GUIDE.md
import { useState, useCallback } from 'react';
import { dataportApi } from '../api/dataport';
import type { ExportResponse, ImportRequest, ImportResponse } from '../types/dataport';

export function useDataport() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportData = useCallback(async (topicIds?: string[]): Promise<ExportResponse> => {
    setLoading(true);
    setError(null);
    try {
      const res = await dataportApi.export(topicIds);
      return res.data;
    } catch {
      setError('Export failed');
      throw new Error('Export failed');
    } finally {
      setLoading(false);
    }
  }, []);

  const importData = useCallback(async (data: ImportRequest): Promise<ImportResponse> => {
    setLoading(true);
    setError(null);
    try {
      const res = await dataportApi.import(data);
      return res.data;
    } catch {
      setError('Import failed');
      throw new Error('Import failed');
    } finally {
      setLoading(false);
    }
  }, []);

  return { exportData, importData, loading, error };
}
