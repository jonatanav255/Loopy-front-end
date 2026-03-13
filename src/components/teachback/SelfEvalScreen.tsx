// Dependencies: useState — see DEPENDENCY_GUIDE.md
import { useState } from 'react';
import { useI18n } from '../../contexts/I18nContext';
import type { ConceptResponse } from '../../types/concept';

interface SelfEvalScreenProps {
  concept: ConceptResponse;
  explanation: string;
  onSubmit: (selfRating: number, gapsFound: string[]) => void;
  onBack: () => void;
}

export function SelfEvalScreen({ concept, explanation, onSubmit, onBack }: SelfEvalScreenProps) {
  const [rating, setRating] = useState<number | null>(null);
  const [gaps, setGaps] = useState('');
  const { t } = useI18n();

  const ratingLabels = [
    { value: 1, label: t.teachBack.rating1 },
    { value: 2, label: t.teachBack.rating2 },
    { value: 3, label: t.teachBack.rating3 },
    { value: 4, label: t.teachBack.rating4 },
    { value: 5, label: t.teachBack.rating5 },
  ];

  const handleSubmit = () => {
    if (rating === null) return;
    const gapsFound = gaps.split('\n').map(g => g.trim()).filter(Boolean);
    onSubmit(rating, gapsFound);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4">
        <button onClick={onBack} className="text-sm text-content-muted hover:text-content-secondary">{t.teachBack.back}</button>
      </div>
      <h3 className="text-lg font-semibold text-content">{t.teachBack.selfRating}: {concept.title}</h3>

      <div className="mt-4 rounded-lg bg-surface-alt p-4">
        <p className="text-xs font-medium uppercase text-content-faint">{t.teachBack.yourExplanation}</p>
        <p className="mt-1 text-sm text-content-secondary whitespace-pre-wrap">{explanation}</p>
      </div>

      {concept.referenceExplanation && (
        <div className="mt-4 rounded-lg bg-blue-500/10 p-4">
          <p className="text-xs font-medium uppercase text-blue-400">{t.teachBack.referenceExplanation}</p>
          <p className="mt-1 text-sm text-blue-200 whitespace-pre-wrap">{concept.referenceExplanation}</p>
        </div>
      )}

      <div className="mt-6">
        <p className="mb-3 text-sm font-medium text-content-secondary">{t.teachBack.howWell}</p>
        <div className="space-y-2">
          {ratingLabels.map(r => (
            <button
              key={r.value}
              onClick={() => setRating(r.value)}
              className={`w-full rounded-lg border px-4 py-2 text-left text-sm transition-colors ${
                rating === r.value
                  ? 'border-indigo-500 bg-indigo-500/20 text-indigo-400'
                  : 'border-line text-content-secondary hover:bg-surface-alt'
              }`}
            >
              <span className="font-medium">{r.value}.</span> {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-content-secondary">
          {t.teachBack.gapsLabel}
        </label>
        <textarea
          value={gaps}
          onChange={e => setGaps(e.target.value)}
          rows={3}
          placeholder={t.teachBack.gapsPlaceholder}
          className="mt-1 block w-full rounded-md border border-line-strong px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={rating === null}
          className="rounded-md bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {t.teachBack.submit}
        </button>
      </div>
    </div>
  );
}
