// Dependencies: useEffect, useCallback — see DEPENDENCY_GUIDE.md
import { useEffect, useCallback } from 'react';
import { useI18n } from '../../contexts/I18nContext';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ open, title, message, confirmLabel, onConfirm, onCancel }: ConfirmDialogProps) {
  const { t } = useI18n();

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!open) return;
    if (e.key === 'Escape') { e.stopPropagation(); onCancel(); }
    if (e.key === 'Enter') { e.stopPropagation(); onConfirm(); }
  }, [open, onCancel, onConfirm]);

  useEffect(() => {
    if (!open) return;
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-sm rounded-lg bg-surface p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-content">{title}</h3>
        <p className="mt-2 text-sm text-content-tertiary">{message}</p>
        <div className="mt-4 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-md border border-content-muted px-4 py-2 text-sm font-medium text-content hover:bg-surface-hover"
          >
            {t.common.cancel} <span className="text-xs opacity-60">(Esc)</span>
          </button>
          <button
            onClick={onConfirm}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            {confirmLabel ?? t.common.delete} <span className="text-xs opacity-60">(Enter)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
