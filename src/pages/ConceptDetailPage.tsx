// Dependencies: useState, useEffect, useParams, Link — see DEPENDENCY_GUIDE.md
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { topicsApi } from '../api/topics';
import { conceptsApi } from '../api/concepts';
import { useCards } from '../hooks/useCards';
import { useToast } from '../contexts/ToastContext';
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
    addToast('Card created', 'success');
  };

  const handleUpdate = async (data: { front: string; back: string; cardType: CardType; hint?: string; sourceUrl?: string }) => {
    if (!editing) return;
    await updateCard(editing.id, data);
    setEditing(null);
    addToast('Card updated', 'success');
  };

  const handleDelete = async () => {
    if (!deleting) return;
    await deleteCard(deleting.id);
    setDeleting(null);
    addToast('Card deleted', 'success');
  };

  const handleSwitchAlgorithm = async (id: string, algorithm: SchedulingAlgorithm) => {
    await switchAlgorithm(id, algorithm);
    addToast(`Switched to ${algorithm}`, 'success');
  };

  if (loading) return <LoadingSpinner className="py-20" />;

  return (
    <div>
      <div className="mb-1 flex gap-2 text-sm text-indigo-600">
        <Link to="/topics" className="hover:text-indigo-800">Topics</Link>
        <span className="text-gray-400">/</span>
        <Link to={`/topics/${topicId}`} className="hover:text-indigo-800">{topic?.name ?? 'Topic'}</Link>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-semibold text-gray-900">{concept?.title ?? 'Concept'}</h2>
            {concept && <Badge label={concept.status.replace('_', ' ')} color={statusColor[concept.status]} />}
          </div>
          {concept?.notes && <p className="mt-1 text-sm text-gray-600">{concept.notes}</p>}
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          New Card
        </button>
      </div>

      {(showForm || editing) && (
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-medium text-gray-900">
            {editing ? 'Edit Card' : 'New Card'}
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
          title="No cards yet"
          description="Create flashcards to start reviewing this concept."
          action={{ label: 'New Card', onClick: () => setShowForm(true) }}
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
        title="Delete card?"
        message="This will permanently delete this card and its review history."
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
