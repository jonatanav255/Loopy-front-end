interface KbdProps {
  children: React.ReactNode;
  /** Use "inline" inside buttons, "key" (default) for standalone badges */
  variant?: 'key' | 'inline';
}

export function Kbd({ children, variant = 'key' }: KbdProps) {
  if (variant === 'inline') {
    return (
      <kbd className="ml-1 text-[0.75em] font-normal opacity-60">
        {children}
      </kbd>
    );
  }

  return (
    <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded border border-content-muted/40 bg-surface-alt px-1 text-[10px] font-medium text-content-muted shadow-[0_1px_0_0_rgba(255,255,255,0.1)]">
      {children}
    </kbd>
  );
}
