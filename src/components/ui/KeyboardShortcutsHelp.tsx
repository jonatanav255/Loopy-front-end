// Dependencies: useI18n — see DEPENDENCY_GUIDE.md
import { useI18n } from '../../contexts/I18nContext';

interface KeyboardShortcutsHelpProps {
  open: boolean;
  onClose: () => void;
}

function Kbd({ children }: { children: string }) {
  return (
    <kbd className="inline-block min-w-[24px] rounded border border-line-strong bg-surface-alt px-1.5 py-0.5 text-center text-xs font-mono text-content-secondary">
      {children}
    </kbd>
  );
}

function Row({ keys, label }: { keys: string[]; label: string }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm text-content-secondary">{label}</span>
      <div className="flex gap-1">
        {keys.map(k => <Kbd key={k}>{k}</Kbd>)}
      </div>
    </div>
  );
}

export function KeyboardShortcutsHelp({ open, onClose }: KeyboardShortcutsHelpProps) {
  const { t } = useI18n();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-lg bg-surface p-6 shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-content">{t.shortcuts.title}</h3>
          <button onClick={onClose} className="text-content-muted hover:text-content-secondary">✕</button>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-content-faint">
              {t.shortcuts.navigation}
            </h4>
            <div className="divide-y divide-line">
              <Row keys={['Shift', '1']} label={t.shortcuts.goToDashboard} />
              <Row keys={['Shift', '2']} label={t.shortcuts.goToTopics} />
              <Row keys={['Shift', '3']} label={t.shortcuts.goToReview} />
              <Row keys={['Shift', '4']} label={t.shortcuts.goToTeachBack} />
              <Row keys={['Shift', '5']} label={t.shortcuts.goToAI} />
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-content-faint">
              {t.shortcuts.actions}
            </h4>
            <div className="divide-y divide-line">
              <Row keys={['N']} label={t.shortcuts.newItem} />
              <Row keys={['1', '–', '9']} label={t.shortcuts.selectByNumber} />
              <Row keys={['Enter']} label={t.shortcuts.confirmAction} />
              <Row keys={['Esc']} label={t.shortcuts.closeCancel} />
              <Row keys={['?']} label={t.shortcuts.showShortcuts} />
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-content-faint">
              {t.shortcuts.review}
            </h4>
            <div className="divide-y divide-line">
              <Row keys={['Space']} label={t.shortcuts.revealAnswer} />
              <Row keys={['1', '–', '6']} label={t.shortcuts.rateCard} />
              <Row keys={['1', '–', '3']} label={t.shortcuts.confidenceLevel} />
              <Row keys={['P']} label={t.shortcuts.practiceAgain} />
              <Row keys={['Enter']} label={t.shortcuts.backToDashboard} />
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-content-faint">
              {t.shortcuts.general}
            </h4>
            <div className="divide-y divide-line">
              <Row keys={['T']} label={t.shortcuts.cycleTheme} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
