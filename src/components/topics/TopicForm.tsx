// Dependencies: useState, FormEvent — see DEPENDENCY_GUIDE.md
import { useState, type FormEvent } from 'react';
import { useI18n } from '../../contexts/I18nContext';

import type { TopicResponse, CreateTopicRequest } from '../../types/topic';

interface TopicFormProps {
  initial?: TopicResponse;
  onSubmit: (data: CreateTopicRequest) => Promise<void>;
  onCancel: () => void;
}

const COLORS = [
  '#6366F1', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#EF4444', '#8B5CF6', '#14B8A6',
  '#F97316', '#06B6D4', '#84CC16', '#E879F9', '#FB7185', '#A78BFA', '#FBBF24', '#34D399',
];

export function TopicForm({ initial, onSubmit, onCancel }: TopicFormProps) {
  const { t } = useI18n();
  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [colorHex, setColorHex] = useState(initial?.colorHex ?? '#6366F1');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      await onSubmit({ name: name.trim(), description: description.trim() || undefined, colorHex });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-content-secondary">{t.topics.name}</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          maxLength={100}
          required
          className="mt-1 block w-full rounded-md border border-line-strong px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          autoFocus
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-content-secondary">{t.topics.description}</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          maxLength={500}
          rows={3}
          className="mt-1 block w-full rounded-md border border-line-strong px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-content-secondary">{t.topics.color}</label>
        <div className="mt-2 flex gap-2">
          {COLORS.map(c => (
            <button
              key={c}
              type="button"
              onClick={() => setColorHex(c)}
              className={`h-8 w-8 rounded-full border-2 ${colorHex === c ? 'border-content' : 'border-transparent'}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <button type="button" onClick={onCancel} className="rounded-md border border-content-muted px-4 py-2 text-sm font-medium text-content hover:bg-surface-hover">
          {t.common.cancel} <span className="text-xs opacity-60">(Esc)</span>
        </button>
        <button type="submit" disabled={saving || !name.trim()} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50">
          {saving ? t.common.loading : initial ? t.common.update : t.common.create} <span className="text-xs opacity-60">(Enter)</span>
        </button>
      </div>
    </form>
  );
}
