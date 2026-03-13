// Dependencies: useState, useCallback, useNavigate, DndContext, closestCenter, PointerSensor, KeyboardSensor, useSensor, useSensors, SortableContext, rectSortingStrategy, sortableKeyboardCoordinates, arrayMove — see DEPENDENCY_GUIDE.md
import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  arrayMove,
} from '@dnd-kit/sortable';
import { useTopics } from '../hooks/useTopics';
import { useToast } from '../contexts/ToastContext';
import { useI18n } from '../contexts/I18nContext';
import { useKeyboard } from '../hooks/useKeyboard';
import { SortableTopicCard } from '../components/topics/SortableTopicCard';
import { TopicForm } from '../components/topics/TopicForm';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { EmptyState } from '../components/ui/EmptyState';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

import type { TopicResponse, CreateTopicRequest } from '../types/topic';

export function TopicsPage() {
  const { topics, loading, createTopic, updateTopic, deleteTopic, reorderTopics } = useTopics();
  const { addToast } = useToast();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<TopicResponse | null>(null);
  const [deleting, setDeleting] = useState<TopicResponse | null>(null);
  const [items, setItems] = useState<TopicResponse[]>([]);

  useEffect(() => {
    setItems(topics);
  }, [topics]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex(t => t.id === active.id);
    const newIndex = items.findIndex(t => t.id === over.id);
    const newItems = arrayMove(items, oldIndex, newIndex);
    setItems(newItems);
    reorderTopics(newItems.map(t => t.id));
  }

  const handleCreate = async (data: CreateTopicRequest) => {
    await createTopic(data);
    setShowForm(false);
    addToast(t.topics.topicCreated, 'success');
  };

  const handleUpdate = async (data: CreateTopicRequest) => {
    if (!editing) return;
    await updateTopic(editing.id, data);
    setEditing(null);
    addToast(t.topics.topicUpdated, 'success');
  };

  const handleDelete = async () => {
    if (!deleting) return;
    await deleteTopic(deleting.id);
    setDeleting(null);
    addToast(t.topics.topicDeleted, 'success');
  };

  const handleKeyboard = useCallback((key: string, e: KeyboardEvent) => {
    if (key === 'n' || key === 'N') {
      e.preventDefault();
      setShowForm(true);
    } else if (key === 'Escape') {
      setShowForm(false);
      setEditing(null);
      setDeleting(null);
    } else {
      const num = parseInt(key);
      if (num >= 1 && num <= 9 && num <= items.length) {
        navigate(`/topics/${items[num - 1].id}`);
      }
    }
  }, [items, navigate]);

  useKeyboard(handleKeyboard);

  if (loading) return <LoadingSpinner className="py-20" />;

  if (showForm || editing) {
    return (
      <div>
        <div className="mb-3">
          <h2 className="text-2xl font-semibold text-content">{t.topics.title}</h2>
        </div>
        <div className="rounded-lg border border-line bg-surface p-6">
          <h3 className="mb-4 text-lg font-medium text-content">
            {editing ? t.topics.editTopic : t.topics.newTopic}
          </h3>
          <TopicForm
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
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-content">{t.topics.title}</h2>
        <button
          onClick={() => setShowForm(true)}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
        >
          {t.topics.newTopic} <span className="ml-1 text-xs opacity-60">(N)</span>
        </button>
      </div>

      {items.length === 0 ? (
        <EmptyState
          title={t.topics.noTopics}
          description={t.topics.noTopicsDesc}
          action={{ label: t.topics.newTopic, onClick: () => setShowForm(true) }}
        />
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map(t => t.id)} strategy={rectSortingStrategy}>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((topic, i) => (
                <SortableTopicCard
                  key={topic.id}
                  topic={topic}
                  index={i < 9 ? i + 1 : undefined}
                  onEdit={() => setEditing(topic)}
                  onDelete={() => setDeleting(topic)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <ConfirmDialog
        open={!!deleting}
        title={t.topics.deleteTopic}
        message={t.topics.deleteTopicMsg.replace('{name}', deleting?.name ?? '')}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
