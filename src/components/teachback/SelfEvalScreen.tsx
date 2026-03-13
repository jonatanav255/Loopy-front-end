// Dependencies: useState — see DEPENDENCY_GUIDE.md
import { useState } from 'react';
import type { ConceptResponse } from '../../types/concept';

const ratingLabels = [
  { value: 1, label: 'Very confused — could not explain at all' },
  { value: 2, label: 'Shaky — missed major parts' },
  { value: 3, label: 'Partial — got the gist but gaps remain' },
  { value: 4, label: 'Good — mostly accurate, minor gaps' },
  { value: 5, label: 'Confident — clear and complete' },
];

interface SelfEvalScreenProps {
  concept: ConceptResponse;
  explanation: string;
  onSubmit: (selfRating: number, gapsFound: string[]) => void;
  onBack: () => void;
}

export function SelfEvalScreen({ concept, explanation, onSubmit, onBack }: SelfEvalScreenProps) {
  const [rating, setRating] = useState<number | null>(null);
  const [gaps, setGaps] = useState('');

  const handleSubmit = () => {
    if (rating === null) return;
    const gapsFound = gaps.split('\n').map(g => g.trim()).filter(Boolean);
    onSubmit(rating, gapsFound);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4">
        <button onClick={onBack} className="text-sm text-gray-500 hover:text-gray-700">← Back</button>
      </div>
      <h3 className="text-lg font-semibold text-gray-900">Self-Evaluate: {concept.title}</h3>

      <div className="mt-4 rounded-lg bg-gray-50 p-4">
        <p className="text-xs font-medium uppercase text-gray-400">Your Explanation</p>
        <p className="mt-1 text-sm text-gray-700 whitespace-pre-wrap">{explanation}</p>
      </div>

      {concept.referenceExplanation && (
        <div className="mt-4 rounded-lg bg-blue-50 p-4">
          <p className="text-xs font-medium uppercase text-blue-400">Reference Explanation</p>
          <p className="mt-1 text-sm text-blue-900 whitespace-pre-wrap">{concept.referenceExplanation}</p>
        </div>
      )}

      <div className="mt-6">
        <p className="mb-3 text-sm font-medium text-gray-700">How well did you explain it?</p>
        <div className="space-y-2">
          {ratingLabels.map(r => (
            <button
              key={r.value}
              onClick={() => setRating(r.value)}
              className={`w-full rounded-lg border px-4 py-2 text-left text-sm transition-colors ${
                rating === r.value
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="font-medium">{r.value}.</span> {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700">
          Knowledge gaps found (one per line, optional)
        </label>
        <textarea
          value={gaps}
          onChange={e => setGaps(e.target.value)}
          rows={3}
          placeholder="e.g., I forgot how the base case works..."
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={rating === null}
          className="rounded-md bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          Submit Teach-Back
        </button>
      </div>
    </div>
  );
}
