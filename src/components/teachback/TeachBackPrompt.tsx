// Dependencies: useState, FormEvent — see DEPENDENCY_GUIDE.md
import { useState, type FormEvent } from 'react';
import type { ConceptResponse } from '../../types/concept';

interface TeachBackPromptProps {
  concept: ConceptResponse;
  onSubmit: (explanation: string) => void;
  onCancel: () => void;
}

export function TeachBackPrompt({ concept, onSubmit, onCancel }: TeachBackPromptProps) {
  const [explanation, setExplanation] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!explanation.trim()) return;
    onSubmit(explanation.trim());
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4">
        <button onClick={onCancel} className="text-sm text-gray-500 hover:text-gray-700">← Back</button>
      </div>
      <h3 className="text-lg font-semibold text-gray-900">Teach-Back: {concept.title}</h3>
      <p className="mt-2 text-sm text-gray-600">
        Explain this concept in your own words, as if teaching someone else.
      </p>
      <form onSubmit={handleSubmit} className="mt-4">
        <textarea
          value={explanation}
          onChange={e => setExplanation(e.target.value)}
          rows={8}
          required
          placeholder="Write your explanation here..."
          className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          autoFocus
        />
        <div className="mt-4 flex justify-end gap-3">
          <button type="button" onClick={onCancel} className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
            Cancel
          </button>
          <button type="submit" disabled={!explanation.trim()} className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
            Continue to Self-Eval
          </button>
        </div>
      </form>
    </div>
  );
}
