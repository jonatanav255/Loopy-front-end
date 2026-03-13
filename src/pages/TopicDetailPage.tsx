// Dependencies: useState, useEffect, useParams, Link — see DEPENDENCY_GUIDE.md
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { topicsApi } from '../api/topics';
import { useConcepts } from '../hooks/useConcepts';
import { useToast } from '../contexts/ToastContext';
import { ConceptList } from '../components/topics/ConceptList';
import { ConceptForm } from '../components/topics/ConceptForm';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { EmptyState } from '../components/ui/EmptyState';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import type { TopicResponse } from '../types/topic';
import type { ConceptResponse } from '../types/concept';

export function TopicDetailPage() {
  const { topicId } = useParams<{ topicId: string }>();
  const [topic, setTopic] = useState<TopicResponse | null>(null);
  const { concepts, loading, createConcept, updateConcept, deleteConcept } = useConcepts(topicId);
  const { addToast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ConceptResponse | null>(null);
  const [deleting, setDeleting] = useState<ConceptResponse | null>(null);

  useEffect(() => {
    if (!topicId) return;
    topicsApi.get(topicId).then(res => setTopic(res.data));
  }, [topicId]);

  const handleCreate = async (data: { title: string; notes?: string }) => {
    if (!topicId) return;
    await createConcept({ topicId, title: data.title, notes: data.notes });
    setShowForm(false);
    addToast('Concept created', 'success');
  };

  const handleUpdate = async (data: { title: string; notes?: string; referenceExplanation?: string }) => {
    if (!editing) return;
    await updateConcept(editing.id, data);
    setEditing(null);
    addToast('Concept updated', 'success');
  };

  const handleDelete = async () => {
    if (!deleting) return;
    await deleteConcept(deleting.id);
    setDeleting(null);
    addToast('Concept deleted', 'success');
  };

  if (loading) return <LoadingSpinner className="py-20" />;

  return (
    <div>
      <div className="mb-1">
        <Link to="/topics" className="text-sm text-indigo-600 hover:text-indigo-800">
          ← Topics
        </Link>
      </div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {topic && <div className="h-4 w-4 rounded-full" style={{ backgroundColor: topic.colorHex }} />}
          <h2 className="text-2xl font-semibold text-gray-900">{topic?.name ?? 'Topic'}</h2>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          New Concept
        </button>
      </div>

      {topic?.description && (
        <p className="mb-6 text-sm text-gray-600">{topic.description}</p>
      )}

      {(showForm || editing) && (
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-medium text-gray-900">
            {editing ? 'Edit Concept' : 'New Concept'}
          </h3>
          <ConceptForm
            initial={editing ?? undefined}
            onSubmit={editing ? handleUpdate : handleCreate}
            onCancel={() => { setShowForm(false); setEditing(null); }}
          />
        </div>
      )}

      {concepts.length === 0 ? (
        <EmptyState
          title="No concepts yet"
          description="Add concepts to this topic to start creating flashcards."
          action={{ label: 'New Concept', onClick: () => setShowForm(true) }}
        />
      ) : (
        <ConceptList
          topicId={topicId!}
          concepts={concepts}
          onEdit={setEditing}
          onDelete={setDeleting}
        />
      )}

      <ConfirmDialog
        open={!!deleting}
        title="Delete concept?"
        message={`This will permanently delete "${deleting?.title}" and all its cards.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
