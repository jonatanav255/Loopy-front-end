// Dependencies: useState, FormEvent — see DEPENDENCY_GUIDE.md
import { useState, type FormEvent } from 'react';
import { useI18n } from '../../contexts/I18nContext';
import type { CardResponse, CardType } from '../../types/card';

const CARD_TYPES: { value: CardType; label: string; description: string }[] = [
  { value: 'STANDARD', label: 'Standard', description: 'Classic question and answer flashcard' },
  { value: 'CODE_OUTPUT', label: 'Code Output', description: 'Given code, predict what it outputs' },
  { value: 'SPOT_THE_BUG', label: 'Spot the Bug', description: 'Find the error in the code snippet' },
  { value: 'FILL_BLANK', label: 'Fill in the Blank', description: 'Complete the missing part of a statement' },
  { value: 'EXPLAIN_WHEN', label: 'Explain When', description: 'Explain when or why you would use something' },
  { value: 'COMPARE', label: 'Compare', description: 'Compare and contrast two or more concepts' },
];

interface CardFormProps {
  initial?: CardResponse;
  onSubmit: (data: { front: string; back: string; cardType: CardType; hint?: string; sourceUrl?: string }) => Promise<void>;
  onCancel: () => void;
}

export function CardForm({ initial, onSubmit, onCancel }: CardFormProps) {
  const { t } = useI18n();
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
        <label className="block text-sm font-medium text-content-secondary">{t.cards.cardType}</label>
        <select
          value={cardType}
          onChange={e => setCardType(e.target.value as CardType)}
          className="mt-1 block w-full rounded-md border border-line-strong px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          {CARD_TYPES.map(ct => (
            <option key={ct.value} value={ct.value}>{ct.label}</option>
          ))}
        </select>
        <p className="mt-1 text-xs text-content-muted">
          {CARD_TYPES.find(ct => ct.value === cardType)?.description}
        </p>
      </div>
      <div>
        <label className="block text-sm font-medium text-content-secondary">{t.cards.front}</label>
        <textarea
          value={front}
          onChange={e => setFront(e.target.value)}
          required
          rows={isCode ? 6 : 3}
          className={`mt-1 block w-full rounded-md border border-line-strong px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary ${isCode ? 'font-mono' : ''}`}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-content-secondary">{t.cards.back}</label>
        <textarea
          value={back}
          onChange={e => setBack(e.target.value)}
          required
          rows={isCode ? 6 : 3}
          className={`mt-1 block w-full rounded-md border border-line-strong px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary ${isCode ? 'font-mono' : ''}`}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-content-secondary">{t.cards.hint}</label>
        <input
          type="text"
          value={hint}
          onChange={e => setHint(e.target.value)}
          className="mt-1 block w-full rounded-md border border-line-strong px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-content-secondary">{t.cards.sourceUrl}</label>
        <input
          type="url"
          value={sourceUrl}
          onChange={e => setSourceUrl(e.target.value)}
          className="mt-1 block w-full rounded-md border border-line-strong px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
      <div className="flex justify-end gap-3">
        <button type="button" onClick={onCancel} className="rounded-md border border-content-muted px-4 py-2 text-sm font-medium text-content hover:bg-surface-hover">
          {t.common.cancel} <span className="text-xs opacity-60">(Esc)</span>
        </button>
        <button type="submit" disabled={saving || !front.trim() || !back.trim()} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50">
          {saving ? t.common.loading : initial ? t.common.update : t.common.create} <span className="text-xs opacity-60">(Enter)</span>
        </button>
      </div>
    </form>
  );
}
