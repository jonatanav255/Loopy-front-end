// Dependencies: useSortable, CSS, Link — see DEPENDENCY_GUIDE.md
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Link } from 'react-router-dom';
import type { ConceptResponse } from '../../types/concept';
import { Badge } from '../ui/Badge';

const statusColor: Record<string, 'blue' | 'yellow' | 'green' | 'red'> = {
  LEARNING: 'blue',
  REVIEW: 'yellow',
  MASTERED: 'green',
  TEACH_BACK_REQUIRED: 'red',
};

const statusLabel: Record<string, string> = {
  LEARNING: 'Learning',
  REVIEW: 'Review',
  MASTERED: 'Mastered',
  TEACH_BACK_REQUIRED: 'Teach-Back',
};

interface SortableConceptItemProps {
  topicId: string;
  concept: ConceptResponse;
  index: number;
  onEdit: (concept: ConceptResponse) => void;
  onDelete: (concept: ConceptResponse) => void;
}

export function SortableConceptItem({ topicId, concept, index, onEdit, onDelete }: SortableConceptItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: concept.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="group flex items-center justify-between rounded-lg border border-line bg-surface px-4 py-3 transition-shadow hover:shadow-sm"
    >
      <div
        {...listeners}
        className="mr-3 flex-shrink-0 cursor-grab text-content-faint opacity-0 transition-opacity hover:text-content-secondary group-hover:opacity-100 active:cursor-grabbing"
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
      <Link to={`/topics/${topicId}/concepts/${concept.id}`} className="flex-1">
        <div className="flex items-center gap-3">
          <span className="font-medium text-content">{concept.title}</span>
          <Badge label={statusLabel[concept.status]} color={statusColor[concept.status]} />
          {index < 9 && (
            <span className="flex h-5 w-5 items-center justify-center rounded bg-surface-alt text-[10px] font-medium text-content-faint">{index + 1}</span>
          )}
        </div>
        {concept.notes && (
          <p className="mt-0.5 line-clamp-1 text-sm text-primary-text">{concept.notes}</p>
        )}
      </Link>
      <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button onClick={() => onEdit(concept)} className="rounded p-1 text-content-secondary hover:bg-surface-hover hover:text-content" title="Edit">
          ✎
        </button>
        <button onClick={() => onDelete(concept)} className="rounded p-1 text-content-secondary hover:bg-red-500/10 hover:text-red-400" title="Delete">
          ✕
        </button>
      </div>
    </div>
  );
}
