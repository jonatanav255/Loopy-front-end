// Dependencies: useState, useEffect, useParams, Link, useNavigate, useCallback — see DEPENDENCY_GUIDE.md
import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { topicsApi } from '../api/topics';
import { useConcepts } from '../hooks/useConcepts';
import { useToast } from '../contexts/ToastContext';
import { useI18n } from '../contexts/I18nContext';
import { useKeyboard } from '../hooks/useKeyboard';
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
  const { concepts, loading, createConcept, updateConcept, deleteConcept, reorderConcepts } = useConcepts(topicId);
  const { addToast } = useToast();
  const { t } = useI18n();
  const navigate = useNavigate();
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
    addToast(t.concepts.conceptCreated, 'success');
  };

  const handleUpdate = async (data: { title: string; notes?: string; referenceExplanation?: string }) => {
    if (!editing) return;
    await updateConcept(editing.id, data);
    setEditing(null);
    addToast(t.concepts.conceptUpdated, 'success');
  };

  const handleDelete = async () => {
    if (!deleting) return;
    await deleteConcept(deleting.id);
    setDeleting(null);
    addToast(t.concepts.conceptDeleted, 'success');
  };

  const handleKeyboard = useCallback((key: string, e: KeyboardEvent) => {
    if (key === 'n' || key === 'N') {
      e.preventDefault();
      setShowForm(true);
    } else if (key === 'Escape') {
      if (showForm || editing || deleting) {
        setShowForm(false);
        setEditing(null);
        setDeleting(null);
      } else {
        navigate('/topics');
      }
    } else {
      const num = parseInt(key);
      if (num >= 1 && num <= 9 && num <= concepts.length) {
        navigate(`/topics/${topicId}/concepts/${concepts[num - 1].id}`);
      }
    }
  }, [showForm, editing, deleting, navigate, concepts, topicId]);

  useKeyboard(handleKeyboard);

  if (loading) return <LoadingSpinner className="py-20" />;

  if (showForm || editing) {
    return (
      <div>
        <div className="mb-1">
          <Link to="/topics" className="text-sm text-primary-text hover:text-primary-muted">
            ← {t.common.backTo} {t.topics.title} <span className="text-xs opacity-60">(Esc)</span>
          </Link>
        </div>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              {topic && <div className="h-4 w-4 rounded-full" style={{ backgroundColor: topic.colorHex }} />}
              <h2 className="text-2xl font-semibold text-content">{topic?.name ?? t.topics.title}</h2>
            </div>
            {topic?.description && (
              <p className="mt-1 ml-7 text-sm text-content-tertiary">{topic.description}</p>
            )}
          </div>
        </div>
        <div className="rounded-lg border border-line bg-surface p-6">
          <h3 className="mb-4 text-lg font-medium text-content">
            {editing ? t.concepts.editConcept : t.concepts.newConcept}
          </h3>
          <ConceptForm
            initial={editing ?? undefined}
            onSubmit={editing ? handleUpdate : handleCreate}
            onCancel={() => { setShowForm(false); setEditing(null); }}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-1">
        <Link to="/topics" className="text-sm text-primary-text hover:text-primary-muted">
          ← {t.common.backTo} {t.topics.title} <span className="text-xs opacity-60">(Esc)</span>
        </Link>
      </div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            {topic && <div className="h-4 w-4 rounded-full" style={{ backgroundColor: topic.colorHex }} />}
            <h2 className="text-2xl font-semibold text-content">{topic?.name ?? t.topics.title}</h2>
          </div>
          {topic?.description && (
            <p className="mt-1 ml-7 text-sm text-content-tertiary">{topic.description}</p>
          )}
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
        >
          {t.concepts.newConcept} <span className="ml-1 text-xs opacity-60">(N)</span>
        </button>
      </div>

      {concepts.length === 0 ? (
        <EmptyState
          title={t.concepts.noConcepts}
          description={t.concepts.noConceptsDesc}
          action={{ label: t.concepts.newConcept, onClick: () => setShowForm(true) }}
        />
      ) : (
        <ConceptList
          topicId={topicId!}
          concepts={concepts}
          onEdit={setEditing}
          onDelete={setDeleting}
          onReorder={reorderConcepts}
        />
      )}

      <ConfirmDialog
        open={!!deleting}
        title={t.concepts.deleteConcept}
        message={t.concepts.deleteConceptMsg.replace('{name}', deleting?.title ?? '')}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
