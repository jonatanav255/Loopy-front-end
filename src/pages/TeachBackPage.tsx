// Dependencies: useState — see DEPENDENCY_GUIDE.md
import { useState } from 'react';
import { useTeachBack } from '../hooks/useTeachBack';
import { useToast } from '../contexts/ToastContext';
import { PendingList } from '../components/teachback/PendingList';
import { TeachBackPrompt } from '../components/teachback/TeachBackPrompt';
import { SelfEvalScreen } from '../components/teachback/SelfEvalScreen';
import { GapMarking } from '../components/teachback/GapMarking';
import { EmptyState } from '../components/ui/EmptyState';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import type { ConceptResponse } from '../types/concept';
import type { TeachBackResponse } from '../types/teachback';

type Step = 'list' | 'write' | 'eval' | 'result';

export function TeachBackPage() {
  const { pending, loading, submit, refetch } = useTeachBack();
  const { addToast } = useToast();
  const [step, setStep] = useState<Step>('list');
  const [selected, setSelected] = useState<ConceptResponse | null>(null);
  const [explanation, setExplanation] = useState('');
  const [result, setResult] = useState<TeachBackResponse | null>(null);

  const handleSelect = (concept: ConceptResponse) => {
    setSelected(concept);
    setStep('write');
  };

  const handleExplanation = (text: string) => {
    setExplanation(text);
    setStep('eval');
  };

  const handleSubmit = async (selfRating: number, gapsFound: string[]) => {
    if (!selected) return;
    try {
      const res = await submit({ conceptId: selected.id, userExplanation: explanation, selfRating, gapsFound });
      setResult(res);
      setStep('result');
      addToast('Teach-back submitted', 'success');
    } catch {
      addToast('Failed to submit teach-back', 'error');
    }
  };

  const handleDone = () => {
    setStep('list');
    setSelected(null);
    setExplanation('');
    setResult(null);
    refetch();
  };

  if (loading) return <LoadingSpinner className="py-20" />;

  if (step === 'write' && selected) {
    return <TeachBackPrompt concept={selected} onSubmit={handleExplanation} onCancel={() => setStep('list')} />;
  }

  if (step === 'eval' && selected) {
    return <SelfEvalScreen concept={selected} explanation={explanation} onSubmit={handleSubmit} onBack={() => setStep('write')} />;
  }

  if (step === 'result' && result) {
    return <GapMarking result={result} onDone={handleDone} />;
  }

  return (
    <div>
      <h2 className="mb-6 text-2xl font-semibold text-gray-900">Teach-Back</h2>
      <p className="mb-4 text-sm text-gray-600">
        Concepts flagged for teach-back — explain them in your own words to deepen understanding.
      </p>

      {pending.length === 0 ? (
        <EmptyState
          title="No teach-backs pending"
          description="Concepts requiring teach-back will appear here after reviews."
        />
      ) : (
        <PendingList concepts={pending} onSelect={handleSelect} />
      )}
    </div>
  );
}
