// Dependencies: useState, useEffect, useParams, Link, useCallback — see DEPENDENCY_GUIDE.md
import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { topicsApi } from '../api/topics';
import { conceptsApi } from '../api/concepts';
import { useCards } from '../hooks/useCards';
import { useToast } from '../contexts/ToastContext';
import { useI18n } from '../contexts/I18nContext';
import { useKeyboard } from '../hooks/useKeyboard';
import { CardList } from '../components/cards/CardList';
import { CardForm } from '../components/cards/CardForm';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { EmptyState } from '../components/ui/EmptyState';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Badge } from '../components/ui/Badge';
import type { TopicResponse } from '../types/topic';
import type { ConceptResponse } from '../types/concept';
import type { CardResponse, CardType, SchedulingAlgorithm } from '../types/card';

const statusColor: Record<string, 'blue' | 'yellow' | 'green' | 'red'> = {
  LEARNING: 'blue',
  REVIEW: 'yellow',
  MASTERED: 'green',
  TEACH_BACK_REQUIRED: 'red',
};

export function ConceptDetailPage() {
  const { topicId, conceptId } = useParams<{ topicId: string; conceptId: string }>();
  const [topic, setTopic] = useState<TopicResponse | null>(null);
  const [concept, setConcept] = useState<ConceptResponse | null>(null);
  const { cards, loading, createCard, updateCard, deleteCard, switchAlgorithm } = useCards(conceptId);
  const { addToast } = useToast();
  const { t } = useI18n();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<CardResponse | null>(null);
  const [deleting, setDeleting] = useState<CardResponse | null>(null);

  useEffect(() => {
    if (topicId) topicsApi.get(topicId).then(res => setTopic(res.data));
    if (conceptId) conceptsApi.get(conceptId).then(res => setConcept(res.data));
  }, [topicId, conceptId]);

  const handleCreate = async (data: { front: string; back: string; cardType: CardType; hint?: string; sourceUrl?: string }) => {
    if (!conceptId) return;
    await createCard({ conceptId, ...data });
    setShowForm(false);
    addToast(t.cards.cardCreated, 'success');
  };

  const handleUpdate = async (data: { front: string; back: string; cardType: CardType; hint?: string; sourceUrl?: string }) => {
    if (!editing) return;
    await updateCard(editing.id, data);
    setEditing(null);
    addToast(t.cards.cardUpdated, 'success');
  };

  const handleDelete = async () => {
    if (!deleting) return;
    await deleteCard(deleting.id);
    setDeleting(null);
    addToast(t.cards.cardDeleted, 'success');
  };

  const handleSwitchAlgorithm = async (id: string, algorithm: SchedulingAlgorithm) => {
    await switchAlgorithm(id, algorithm);
    addToast(t.cards.switchedTo.replace('{algorithm}', algorithm), 'success');
  };

  const handleKeyboard = useCallback((key: string, e: KeyboardEvent) => {
    if (key === 'n' || key === 'N') {
      e.preventDefault();
      setShowForm(true);
    } else if (key === 'Escape') {
      setShowForm(false);
      setEditing(null);
      setDeleting(null);
    }
  }, []);

  useKeyboard(handleKeyboard);

  if (loading) return <LoadingSpinner className="py-20" />;

  return (
    <div>
      <div className="mb-1 flex gap-2 text-sm text-indigo-400">
        <Link to="/topics" className="hover:text-indigo-300">{t.topics.title}</Link>
        <span className="text-content-faint">/</span>
        <Link to={`/topics/${topicId}`} className="hover:text-indigo-300">{topic?.name ?? t.topics.title}</Link>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-semibold text-content">{concept?.title ?? 'Concept'}</h2>
            {concept && <Badge label={concept.status.replace('_', ' ')} color={statusColor[concept.status]} />}
          </div>
          {concept?.notes && <p className="mt-1 text-sm text-content-tertiary">{concept.notes}</p>}
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          {t.cards.newCard} <span className="ml-1 text-xs opacity-60">(N)</span>
        </button>
      </div>

      {(showForm || editing) && (
        <div className="mb-6 rounded-lg border border-line bg-surface p-6">
          <h3 className="mb-4 text-lg font-medium text-content">
            {editing ? t.cards.editCard : t.cards.newCard}
          </h3>
          <CardForm
            initial={editing ?? undefined}
            onSubmit={editing ? handleUpdate : handleCreate}
            onCancel={() => { setShowForm(false); setEditing(null); }}
          />
        </div>
      )}

      {cards.length === 0 ? (
        <EmptyState
          title={t.cards.noCards}
          description={t.cards.noCardsDesc}
          action={{ label: t.cards.newCard, onClick: () => setShowForm(true) }}
        />
      ) : (
        <CardList
          cards={cards}
          onEdit={setEditing}
          onDelete={setDeleting}
          onSwitchAlgorithm={handleSwitchAlgorithm}
        />
      )}

      <ConfirmDialog
        open={!!deleting}
        title={t.cards.deleteCard}
        message={t.cards.deleteCardMsg}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
