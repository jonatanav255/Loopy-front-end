// Dependencies: useState, useCallback — see DEPENDENCY_GUIDE.md
import { useState, useCallback } from 'react';
import { useTeachBack } from '../hooks/useTeachBack';
import { useToast } from '../contexts/ToastContext';
import { useI18n } from '../contexts/I18nContext';
import { useKeyboard } from '../hooks/useKeyboard';
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
  const { t } = useI18n();
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
      addToast(t.teachBack.submitted, 'success');
    } catch {
      addToast(t.teachBack.submitFailed, 'error');
    }
  };

  const handleDone = () => {
    setStep('list');
    setSelected(null);
    setExplanation('');
    setResult(null);
    refetch();
  };

  const handleKeyboard = useCallback((key: string) => {
    if (step === 'list') {
      const num = parseInt(key);
      if (num >= 1 && num <= 9 && num <= pending.length) {
        handleSelect(pending[num - 1]);
      }
    }
    if (step === 'result' && (key === 'Enter' || key === 'Escape')) {
      handleDone();
    }
  }, [step, pending]);

  useKeyboard(handleKeyboard);

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
      <h2 className="mb-3 text-2xl font-semibold text-content">{t.teachBack.title}</h2>
      <p className="mb-4 text-sm text-content-tertiary">
        {t.teachBack.description}
      </p>

      {pending.length === 0 ? (
        <EmptyState
          title={t.teachBack.noPending}
          description={t.teachBack.noPendingDesc}
        />
      ) : (
        <PendingList concepts={pending} onSelect={handleSelect} />
      )}
    </div>
  );
}
