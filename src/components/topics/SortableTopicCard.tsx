// Dependencies: useSortable, CSS — see DEPENDENCY_GUIDE.md
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TopicCard } from './TopicCard';
import type { TopicResponse } from '../../types/topic';

interface SortableTopicCardProps {
  topic: TopicResponse;
  index?: number;
  onEdit: () => void;
  onDelete: () => void;
}

export function SortableTopicCard({ topic, index, onEdit, onDelete }: SortableTopicCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: topic.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div className="relative">
        <div
          {...listeners}
          className="absolute left-2 top-1/2 z-10 -translate-y-1/2 cursor-grab rounded p-1 text-content-faint opacity-0 transition-opacity hover:text-content-secondary group-hover:opacity-100 active:cursor-grabbing"
          style={{ opacity: isDragging ? 1 : undefined }}
          title="Drag to reorder"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <circle cx="5" cy="3" r="1.5" />
            <circle cx="11" cy="3" r="1.5" />
            <circle cx="5" cy="8" r="1.5" />
            <circle cx="11" cy="8" r="1.5" />
            <circle cx="5" cy="13" r="1.5" />
            <circle cx="11" cy="13" r="1.5" />
          </svg>
        </div>
        <TopicCard topic={topic} index={index} onEdit={onEdit} onDelete={onDelete} />
      </div>
    </div>
  );
}
