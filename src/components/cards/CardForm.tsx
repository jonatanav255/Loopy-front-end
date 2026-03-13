// Dependencies: useState, FormEvent — see DEPENDENCY_GUIDE.md
import { useState, type FormEvent } from 'react';
import type { CardResponse, CardType } from '../../types/card';

const CARD_TYPES: { value: CardType; label: string }[] = [
  { value: 'STANDARD', label: 'Standard' },
  { value: 'CODE_OUTPUT', label: 'Code Output' },
  { value: 'SPOT_THE_BUG', label: 'Spot the Bug' },
  { value: 'FILL_BLANK', label: 'Fill in the Blank' },
  { value: 'EXPLAIN_WHEN', label: 'Explain When' },
  { value: 'COMPARE', label: 'Compare' },
];

interface CardFormProps {
  initial?: CardResponse;
  onSubmit: (data: { front: string; back: string; cardType: CardType; hint?: string; sourceUrl?: string }) => Promise<void>;
  onCancel: () => void;
}

export function CardForm({ initial, onSubmit, onCancel }: CardFormProps) {
  const [front, setFront] = useState(initial?.front ?? '');
  const [back, setBack] = useState(initial?.back ?? '');
  const [cardType, setCardType] = useState<CardType>(initial?.cardType ?? 'STANDARD');
  const [hint, setHint] = useState(initial?.hint ?? '');
  const [sourceUrl, setSourceUrl] = useState(initial?.sourceUrl ?? '');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!front.trim() || !back.trim()) return;
    setSaving(true);
    try {
      await onSubmit({
        front: front.trim(),
        back: back.trim(),
        cardType,
        hint: hint.trim() || undefined,
        sourceUrl: sourceUrl.trim() || undefined,
      });
    } finally {
      setSaving(false);
    }
  };

  const isCode = cardType === 'CODE_OUTPUT' || cardType === 'SPOT_THE_BUG';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-content-secondary">Type</label>
        <select
          value={cardType}
          onChange={e => setCardType(e.target.value as CardType)}
          className="mt-1 block w-full rounded-md border border-line-strong px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          {CARD_TYPES.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-content-secondary">Front</label>
        <textarea
          value={front}
          onChange={e => setFront(e.target.value)}
          required
          rows={isCode ? 6 : 3}
          className={`mt-1 block w-full rounded-md border border-line-strong px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 ${isCode ? 'font-mono' : ''}`}
          placeholder={isCode ? 'Paste code here...' : 'Question or prompt'}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-content-secondary">Back</label>
        <textarea
          value={back}
          onChange={e => setBack(e.target.value)}
          required
          rows={isCode ? 6 : 3}
          className={`mt-1 block w-full rounded-md border border-line-strong px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 ${isCode ? 'font-mono' : ''}`}
          placeholder="Answer"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-content-secondary">Hint (optional)</label>
        <input
          type="text"
          value={hint}
          onChange={e => setHint(e.target.value)}
          className="mt-1 block w-full rounded-md border border-line-strong px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-content-secondary">Source URL (optional)</label>
        <input
          type="url"
          value={sourceUrl}
          onChange={e => setSourceUrl(e.target.value)}
          className="mt-1 block w-full rounded-md border border-line-strong px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>
      <div className="flex justify-end gap-3">
        <button type="button" onClick={onCancel} className="rounded-md px-4 py-2 text-sm font-medium text-content-secondary hover:bg-surface-hover">
          Cancel
        </button>
        <button type="submit" disabled={saving || !front.trim() || !back.trim()} className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
          {saving ? 'Saving...' : initial ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}
