// Dependencies: Link — see DEPENDENCY_GUIDE.md
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

interface ConceptListProps {
  topicId: string;
  concepts: ConceptResponse[];
  onEdit: (concept: ConceptResponse) => void;
  onDelete: (concept: ConceptResponse) => void;
}

export function ConceptList({ topicId, concepts, onEdit, onDelete }: ConceptListProps) {
  return (
    <div className="space-y-2">
      {concepts.map(concept => (
        <div key={concept.id} className="group flex items-center justify-between rounded-lg border border-line bg-surface px-4 py-3 transition-shadow hover:shadow-sm">
          <Link to={`/topics/${topicId}/concepts/${concept.id}`} className="flex-1">
            <div className="flex items-center gap-3">
              <span className="font-medium text-content">{concept.title}</span>
              <Badge label={statusLabel[concept.status]} color={statusColor[concept.status]} />
            </div>
            {concept.notes && (
              <p className="mt-0.5 line-clamp-1 text-sm text-content-muted">{concept.notes}</p>
            )}
          </Link>
          <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button onClick={() => onEdit(concept)} className="rounded p-1 text-content-faint hover:bg-surface-hover hover:text-content-tertiary" title="Edit">
              ✎
            </button>
            <button onClick={() => onDelete(concept)} className="rounded p-1 text-content-faint hover:bg-red-500/10 hover:text-red-400" title="Delete">
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
