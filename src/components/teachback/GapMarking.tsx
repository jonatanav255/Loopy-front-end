import type { TeachBackResponse } from '../../types/teachback';

interface GapMarkingProps {
  result: TeachBackResponse;
  onDone: () => void;
}

export function GapMarking({ result, onDone }: GapMarkingProps) {
  return (
    <div className="mx-auto max-w-2xl">
      <h3 className="text-lg font-semibold text-content">Teach-Back Complete</h3>
      <p className="mt-1 text-sm text-content-tertiary">{result.conceptTitle}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-line bg-surface p-4">
          <p className="text-sm font-medium text-content-secondary">Self Rating</p>
          <p className="mt-1 text-3xl font-bold text-indigo-600">{result.selfRating}/5</p>
        </div>
        <div className="rounded-lg border border-line bg-surface p-4">
          <p className="text-sm font-medium text-content-secondary">Gaps Found</p>
          <p className="mt-1 text-3xl font-bold text-orange-600">{result.gapsFound.length}</p>
        </div>
      </div>

      {result.gapsFound.length > 0 && (
        <div className="mt-4 rounded-lg bg-orange-500/10 p-4">
          <p className="mb-2 text-sm font-medium text-orange-300">Knowledge Gaps</p>
          <ul className="space-y-1">
            {result.gapsFound.map((gap, i) => (
              <li key={i} className="text-sm text-orange-200">• {gap}</li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={onDone}
        className="mt-6 rounded-md bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700"
      >
        Done
      </button>
    </div>
  );
}
