// Dependencies: useState, useEffect, FormEvent — see DEPENDENCY_GUIDE.md
import { useState, useEffect, type FormEvent } from 'react';
import { topicsApi } from '../../api/topics';
import { conceptsApi } from '../../api/concepts';
import type { TopicResponse } from '../../types/topic';
import type { ConceptResponse } from '../../types/concept';
import type { GeneratedCard } from '../../types/ai';

interface GenerateCardsPanelProps {
  onGenerate: (conceptId: string, content: string) => Promise<GeneratedCard[]>;
  onCardsGenerated: (conceptId: string, cards: GeneratedCard[]) => void;
}

export function GenerateCardsPanel({ onGenerate, onCardsGenerated }: GenerateCardsPanelProps) {
  const [topics, setTopics] = useState<TopicResponse[]>([]);
  const [concepts, setConcepts] = useState<ConceptResponse[]>([]);
  const [topicId, setTopicId] = useState('');
  const [conceptId, setConceptId] = useState('');
  const [content, setContent] = useState('');
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
      const cards = await onGenerate(conceptId, content.trim());
      onCardsGenerated(conceptId, cards);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-line bg-surface p-6">
      <h3 className="font-medium text-content">Generate Cards with AI</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-content-secondary">Topic</label>
          <select
            value={topicId}
            onChange={e => setTopicId(e.target.value)}
            className="mt-1 block w-full rounded-md border border-line-strong px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">Select topic...</option>
            {topics.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-content-secondary">Concept</label>
          <select
            value={conceptId}
            onChange={e => setConceptId(e.target.value)}
            disabled={!topicId}
            className="mt-1 block w-full rounded-md border border-line-strong px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
          >
            <option value="">Select concept...</option>
            {concepts.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-content-secondary">Content / Notes</label>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={6}
          required
          placeholder="Paste study material, notes, or text to generate flashcards from..."
          className="mt-1 block w-full rounded-md border border-line-strong px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={generating || !conceptId || !content.trim()}
          className="rounded-md bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {generating ? 'Generating...' : 'Generate Cards'}
        </button>
      </div>
    </form>
  );
}
