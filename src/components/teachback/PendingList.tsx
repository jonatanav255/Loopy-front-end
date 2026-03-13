import type { ConceptResponse } from '../../types/concept';


interface PendingListProps {
  concepts: ConceptResponse[];
  onSelect: (concept: ConceptResponse) => void;
}

export function PendingList({ concepts, onSelect }: PendingListProps) {
  return (
    <div className="space-y-2">
      {concepts.map((concept, index) => (
        <button
          key={concept.id}
          onClick={() => onSelect(concept)}
          className="w-full rounded-lg border border-line bg-surface px-4 py-3 text-left transition-shadow hover:shadow-sm"
        >
          <div className="flex items-center gap-3">
            {index < 9 && (
              <span className="flex h-5 w-5 items-center justify-center rounded bg-surface-alt text-[10px] font-medium text-content-faint">{index + 1}</span>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-content">{concept.title}</p>
              {concept.notes && <p className="mt-0.5 line-clamp-1 text-sm text-content-muted">{concept.notes}</p>}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
