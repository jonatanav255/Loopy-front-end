// Dependencies: useState, useEffect, FormEvent — see DEPENDENCY_GUIDE.md
import { useState, useEffect, type FormEvent } from 'react';
import { useI18n } from '../../contexts/I18nContext';

import { topicsApi } from '../../api/topics';
import { conceptsApi } from '../../api/concepts';
import type { TopicResponse } from '../../types/topic';
import type { ConceptResponse } from '../../types/concept';
import type { GeneratedCard } from '../../types/ai';

interface GenerateCardsPanelProps {
  onGenerate: (conceptId: string, content: string, numCards: number) => Promise<GeneratedCard[]>;
  onCardsGenerated: (conceptId: string, cards: GeneratedCard[]) => void;
  formRef?: React.Ref<HTMLFormElement>;
}

export function GenerateCardsPanel({ onGenerate, onCardsGenerated, formRef }: GenerateCardsPanelProps) {
  const { t } = useI18n();
  const [topics, setTopics] = useState<TopicResponse[]>([]);
  const [concepts, setConcepts] = useState<ConceptResponse[]>([]);
  const [topicId, setTopicId] = useState('');
  const [conceptId, setConceptId] = useState('');
  const [content, setContent] = useState('');
  const [numCards, setNumCards] = useState(5);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    topicsApi.list().then(res => setTopics(res.data));
  }, []);

  useEffect(() => {
    if (!topicId) { setConcepts([]); setConceptId(''); return; }
    conceptsApi.list(topicId).then(res => setConcepts(res.data));
    setConceptId('');
  }, [topicId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!conceptId || !content.trim()) return;
    setGenerating(true);
    try {
      const cards = await onGenerate(conceptId, content.trim(), numCards);
      onCardsGenerated(conceptId, cards);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-line bg-surface p-6">
      <h3 className="font-medium text-content">{t.ai.generateTitle}</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-content-secondary">{t.ai.topic}</label>
          <select
            value={topicId}
            onChange={e => setTopicId(e.target.value)}
            className="mt-1 block w-full rounded-md border border-line-strong px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">{t.ai.selectTopic}</option>
            {topics.map(tp => <option key={tp.id} value={tp.id}>{tp.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-content-secondary">{t.ai.concept}</label>
          <select
            value={conceptId}
            onChange={e => setConceptId(e.target.value)}
            disabled={!topicId}
            className="mt-1 block w-full rounded-md border border-line-strong px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
          >
            <option value="">{t.ai.selectConcept}</option>
            {concepts.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-content-secondary">{t.ai.contentLabel}</label>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={6}
          required
          maxLength={10000}
          placeholder={t.ai.contentPlaceholder}
          className="mt-1 block w-full resize-none rounded-md border border-line-strong px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <p className={`mt-1 text-right text-xs ${content.length > 9500 ? 'text-yellow-400' : 'text-content-faint'}`}>
          {content.length} / 10,000
        </p>
      </div>
      <div>
        <label className="block text-sm font-medium text-content-secondary">{t.ai.numCards}</label>
        <select
          value={numCards}
          onChange={e => setNumCards(Number(e.target.value))}
          className="mt-1 block w-full rounded-md border border-line-strong px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={20}>20</option>
        </select>
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={generating || !conceptId || !content.trim()}
          className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50"
        >
          {generating ? t.ai.generating : t.ai.generate} {!generating && <span className="text-xs opacity-60">(Enter)</span>}
        </button>
      </div>
    </form>
  );
}
