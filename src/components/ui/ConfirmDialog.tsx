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

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-sm rounded-lg bg-surface p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-content">{title}</h3>
        <p className="mt-2 text-sm text-content-tertiary">{message}</p>
        <div className="mt-4 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-md px-4 py-2 text-sm font-medium text-content-secondary hover:bg-surface-active"
          >
            {t.common.cancel} <span className="text-xs opacity-60">(Esc)</span>
          </button>
          <button
            onClick={onConfirm}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            {confirmLabel ?? t.common.delete}
          </button>
        </div>
      </div>
    </div>
  );
}
