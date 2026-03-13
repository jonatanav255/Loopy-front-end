// Dependencies: useState — see DEPENDENCY_GUIDE.md
import { useState } from 'react';
import { useTopics } from '../hooks/useTopics';
import { useToast } from '../contexts/ToastContext';
import { TopicCard } from '../components/topics/TopicCard';
import { TopicForm } from '../components/topics/TopicForm';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { EmptyState } from '../components/ui/EmptyState';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import type { TopicResponse, CreateTopicRequest } from '../types/topic';

export function TopicsPage() {
  const { topics, loading, createTopic, updateTopic, deleteTopic } = useTopics();
  const { addToast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<TopicResponse | null>(null);
  const [deleting, setDeleting] = useState<TopicResponse | null>(null);

  const handleCreate = async (data: CreateTopicRequest) => {
    await createTopic(data);
    setShowForm(false);
    addToast('Topic created', 'success');
  };

  const handleUpdate = async (data: CreateTopicRequest) => {
    if (!editing) return;
    await updateTopic(editing.id, data);
    setEditing(null);
    addToast('Topic updated', 'success');
  };

  const handleDelete = async () => {
    if (!deleting) return;
    await deleteTopic(deleting.id);
    setDeleting(null);
    addToast('Topic deleted', 'success');
  };

  if (loading) return <LoadingSpinner className="py-20" />;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Topics</h2>
        <button
          onClick={() => setShowForm(true)}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          New Topic
        </button>
      </div>

      {(showForm || editing) && (
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-medium text-gray-900">
            {editing ? 'Edit Topic' : 'New Topic'}
          </h3>
          <TopicForm
            initial={editing ?? undefined}
            onSubmit={editing ? handleUpdate : handleCreate}
            onCancel={() => { setShowForm(false); setEditing(null); }}
          />
        </div>
      )}

      {topics.length === 0 ? (
        <EmptyState
          title="No topics yet"
          description="Create your first topic to start organizing your learning."
          action={{ label: 'New Topic', onClick: () => setShowForm(true) }}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map(topic => (
            <TopicCard
              key={topic.id}
              topic={topic}
              onEdit={() => setEditing(topic)}
              onDelete={() => setDeleting(topic)}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleting}
        title="Delete topic?"
        message={`This will permanently delete "${deleting?.name}" and all its concepts and cards.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
