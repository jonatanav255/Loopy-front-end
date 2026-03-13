// Dependencies: useState, FormEvent — see DEPENDENCY_GUIDE.md
import { useState, type FormEvent } from 'react';
import type { ConceptResponse } from '../../types/concept';

interface ConceptFormProps {
  initial?: ConceptResponse;
  onSubmit: (data: { title: string; notes?: string; referenceExplanation?: string }) => Promise<void>;
  onCancel: () => void;
}

export function ConceptForm({ initial, onSubmit, onCancel }: ConceptFormProps) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [notes, setNotes] = useState(initial?.notes ?? '');
  const [referenceExplanation, setReferenceExplanation] = useState(initial?.referenceExplanation ?? '');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    try {
      await onSubmit({
        title: title.trim(),
        notes: notes.trim() || undefined,
        referenceExplanation: referenceExplanation.trim() || undefined,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-content-secondary">Title</label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          maxLength={200}
          required
          className="mt-1 block w-full rounded-md border border-line-strong px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          autoFocus
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-content-secondary">Notes</label>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border border-line-strong px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>
      {initial && (
        <div>
          <label className="block text-sm font-medium text-content-secondary">Reference Explanation</label>
          <textarea
            value={referenceExplanation}
            onChange={e => setReferenceExplanation(e.target.value)}
            rows={3}
            placeholder="The canonical explanation for teach-back comparisons"
            className="mt-1 block w-full rounded-md border border-line-strong px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      )}
      <div className="flex justify-end gap-3">
        <button type="button" onClick={onCancel} className="rounded-md px-4 py-2 text-sm font-medium text-content-secondary hover:bg-surface-hover">
          Cancel
        </button>
        <button type="submit" disabled={saving || !title.trim()} className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
          {saving ? 'Saving...' : initial ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}
