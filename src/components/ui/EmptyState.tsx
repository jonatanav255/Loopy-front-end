interface EmptyStateProps {
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-line-strong py-12 text-center">
      <h3 className="text-sm font-medium text-content">{title}</h3>
      {description && <p className="mt-1 text-sm text-content-muted">{description}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
