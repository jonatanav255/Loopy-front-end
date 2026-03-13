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
    <div className="group relative overflow-hidden rounded-lg border border-line bg-surface shadow-sm transition-shadow hover:shadow-md">
      <div className="h-1.5" style={{ backgroundColor: topic.colorHex }} />
      <div className="p-5">
        <div className="absolute right-3 top-5 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button onClick={onEdit} className="rounded p-1 text-content-faint hover:bg-surface-hover hover:text-content-tertiary" title="Edit">✎</button>
          <button onClick={onDelete} className="rounded p-1 text-content-faint hover:bg-red-500/10 hover:text-red-400" title="Delete">✕</button>
        </div>
        <Link to={`/topics/${topic.id}`} className="block">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: topic.colorHex }} />
            <h3 className="text-lg font-semibold text-content">{topic.name}</h3>
          </div>
          {topic.description && <p className="mt-1 ml-[18px] line-clamp-2 text-xs text-content-muted">{topic.description}</p>}
        </Link>
      </div>
    </div>
  );
}
