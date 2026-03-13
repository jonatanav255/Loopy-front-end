// Dependencies: useState, FormEvent — see DEPENDENCY_GUIDE.md
import { useState, type FormEvent } from 'react';
import { useI18n } from '../../contexts/I18nContext';
import type { ConceptResponse } from '../../types/concept';

interface TeachBackPromptProps {
  concept: ConceptResponse;
  onSubmit: (explanation: string) => void;
  onCancel: () => void;
}

export function TeachBackPrompt({ concept, onSubmit, onCancel }: TeachBackPromptProps) {
  const [explanation, setExplanation] = useState('');
  const { t } = useI18n();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!explanation.trim()) return;
    onSubmit(explanation.trim());
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4">
        <button onClick={onCancel} className="text-sm text-content-muted hover:text-content-secondary">{t.teachBack.back}</button>
      </div>
      <h3 className="text-lg font-semibold text-content">{t.teachBack.title}: {concept.title}</h3>
      <p className="mt-2 text-sm text-content-tertiary">
        {t.teachBack.explain}
      </p>
      <form onSubmit={handleSubmit} className="mt-4">
        <textarea
          value={explanation}
          onChange={e => setExplanation(e.target.value)}
          rows={8}
          required
          placeholder={t.teachBack.placeholder}
          className="block w-full rounded-lg border border-line-strong px-4 py-3 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          autoFocus
        />
        <div className="mt-4 flex justify-end gap-3">
          <button type="button" onClick={onCancel} className="rounded-md px-4 py-2 text-sm font-medium text-content-secondary hover:bg-surface-hover">
            {t.teachBack.cancel}
          </button>
          <button type="submit" disabled={!explanation.trim()} className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-50">
            {t.teachBack.continueToEval}
          </button>
        </div>
      </form>
    </div>
  );
}
