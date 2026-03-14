// Dependencies: useState, useCallback, useRef — see DEPENDENCY_GUIDE.md
import { useState, useCallback, useRef } from 'react';
import { useDataport } from '../hooks/useDataport';
import { useTopics } from '../hooks/useTopics';
import { useToast } from '../contexts/ToastContext';
import { useI18n } from '../contexts/I18nContext';
import { useKeyboard } from '../hooks/useKeyboard';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import type { ImportRequest } from '../types/dataport';

export function DataPortPage() {
  const { exportData, importData, loading } = useDataport();
  const { topics, loading: topicsLoading, refetch } = useTopics();
  const { addToast } = useToast();
  const { t } = useI18n();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([]);
  const [importResult, setImportResult] = useState<{ topicsCreated: number; conceptsCreated: number; cardsCreated: number } | null>(null);

  const handleExport = useCallback(async () => {
    try {
      const data = await exportData(selectedTopicIds.length > 0 ? selectedTopicIds : undefined);
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `loopy-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      addToast(t.dataport.exportSuccess, 'success');
    } catch {
      addToast(t.dataport.exportFailed, 'error');
    }
  }, [exportData, selectedTopicIds, addToast, t]);

  const handleImport = useCallback(async (file: File) => {
    try {
      const text = await file.text();
      const json = JSON.parse(text) as ImportRequest;

      if (!json.exportVersion || !json.topics) {
        addToast(t.dataport.invalidFile, 'error');
        return;
      }

      const result = await importData(json);
      setImportResult(result);
      addToast(
        t.dataport.importSuccess
          .replace('{topics}', String(result.topicsCreated))
          .replace('{concepts}', String(result.conceptsCreated))
          .replace('{cards}', String(result.cardsCreated)),
        'success',
      );
      refetch();
    } catch {
      addToast(t.dataport.importFailed, 'error');
    }
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [importData, addToast, t, refetch]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImport(file);
  }, [handleImport]);

  const toggleTopicSelection = (id: string) => {
    setSelectedTopicIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id],
    );
  };

  const handleKeyboard = useCallback((key: string) => {
    if (key === 'Escape') {
      setImportResult(null);
    }
  }, []);

  useKeyboard(handleKeyboard);

  if (topicsLoading) return <LoadingSpinner className="py-20" />;

  return (
    <div>
      <div className="mb-3">
        <h2 className="text-2xl font-semibold text-content">{t.dataport.title}</h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Export */}
        <div className="rounded-lg border border-line bg-surface p-6">
          <h3 className="mb-1 text-lg font-medium text-content">{t.dataport.exportTitle}</h3>
          <p className="mb-4 text-sm text-content-muted">{t.dataport.exportDesc}</p>

          {topics.length > 0 && (
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-content-secondary">
                {t.dataport.selectTopics}
              </label>
              <div className="max-h-48 space-y-1 overflow-y-auto rounded-md border border-line p-2">
                {topics.map(topic => (
                  <label
                    key={topic.id}
                    className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 hover:bg-surface-hover"
                  >
                    <input
                      type="checkbox"
                      checked={selectedTopicIds.includes(topic.id)}
                      onChange={() => toggleTopicSelection(topic.id)}
                      className="rounded border-line"
                    />
                    <span
                      className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: topic.colorHex }}
                    />
                    <span className="text-sm text-content">{topic.name}</span>
                    <span className="text-xs text-content-muted">({topic.cardCount} {t.topics.cards})</span>
                  </label>
                ))}
              </div>
              <p className="mt-1 text-xs text-content-muted">{t.dataport.selectNone}</p>
            </div>
          )}

          <button
            onClick={handleExport}
            disabled={loading}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50"
          >
            {loading ? t.dataport.exporting : t.dataport.exportBtn}
          </button>
        </div>

        {/* Import */}
        <div className="rounded-lg border border-line bg-surface p-6">
          <h3 className="mb-1 text-lg font-medium text-content">{t.dataport.importTitle}</h3>
          <p className="mb-4 text-sm text-content-muted">{t.dataport.importDesc}</p>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50"
          >
            {loading ? t.dataport.importing : t.dataport.importBtn}
          </button>

          {importResult && (
            <div className="mt-4 rounded-md border border-line bg-surface-alt p-4">
              <h4 className="mb-2 text-sm font-medium text-content">{t.dataport.importComplete}</h4>
              <ul className="space-y-1 text-sm text-content-secondary">
                <li>{t.dataport.topicsCreated}: {importResult.topicsCreated}</li>
                <li>{t.dataport.conceptsCreated}: {importResult.conceptsCreated}</li>
                <li>{t.dataport.cardsCreated}: {importResult.cardsCreated}</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
