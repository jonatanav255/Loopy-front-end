// Dependencies: useState — see DEPENDENCY_GUIDE.md
import { useState } from 'react';
import type { SchedulingAlgorithm } from '../../types/card';

interface AlgorithmToggleProps {
  current: SchedulingAlgorithm;
  onSwitch: (algorithm: SchedulingAlgorithm) => Promise<void>;
}

export function AlgorithmToggle({ current, onSwitch }: AlgorithmToggleProps) {
  const [switching, setSwitching] = useState(false);
  const next: SchedulingAlgorithm = current === 'SM2' ? 'FSRS' : 'SM2';

  const handleSwitch = async () => {
    setSwitching(true);
    try {
      await onSwitch(next);
    } finally {
      setSwitching(false);
    }
  };

  return (
    <button
      onClick={handleSwitch}
      disabled={switching}
      className="ml-auto text-xs text-indigo-400 hover:text-indigo-300 disabled:opacity-50"
    >
      {switching ? 'Switching...' : `Switch to ${next}`}
    </button>
  );
}
