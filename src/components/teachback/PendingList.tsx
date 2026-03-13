import type { ConceptResponse } from '../../types/concept';

interface PendingListProps {
  concepts: ConceptResponse[];
  onSelect: (concept: ConceptResponse) => void;
}

export function PendingList({ concepts, onSelect }: PendingListProps) {
  return (
    <div className="space-y-2">
      {concepts.map(concept => (
        <button
          key={concept.id}
          onClick={() => onSelect(concept)}
          className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-left transition-shadow hover:shadow-sm"
        >
          <p className="font-medium text-gray-900">{concept.title}</p>
          {concept.notes && <p className="mt-0.5 line-clamp-1 text-sm text-gray-500">{concept.notes}</p>}
        </button>
      ))}
    </div>
  );
}
