// Dependencies: Link — see DEPENDENCY_GUIDE.md
import { Link } from 'react-router-dom';
import type { TopicResponse } from '../../types/topic';

interface TopicCardProps {
  topic: TopicResponse;
  onEdit: () => void;
  onDelete: () => void;
}

export function TopicCard({ topic, onEdit, onDelete }: TopicCardProps) {
  return (
    <div className="group relative rounded-lg border border-line bg-surface p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="absolute right-3 top-3 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button onClick={onEdit} className="rounded p-1 text-content-faint hover:bg-surface-hover hover:text-content-tertiary" title="Edit">
          ✎
        </button>
        <button onClick={onDelete} className="rounded p-1 text-content-faint hover:bg-red-500/10 hover:text-red-400" title="Delete">
          ✕
        </button>
      </div>
      <Link to={`/topics/${topic.id}`} className="block">
        <div className="mb-3 h-2 w-12 rounded-full" style={{ backgroundColor: topic.colorHex }} />
        <h3 className="text-lg font-semibold text-content">{topic.name}</h3>
        {topic.description && (
          <p className="mt-1 line-clamp-2 text-sm text-content-muted">{topic.description}</p>
        )}
      </Link>
    </div>
  );
}
