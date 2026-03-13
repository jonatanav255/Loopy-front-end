const variants: Record<string, string> = {
  green: 'bg-green-500/20 text-green-300',
  yellow: 'bg-yellow-500/20 text-yellow-300',
  blue: 'bg-blue-500/20 text-blue-300',
  red: 'bg-red-500/20 text-red-300',
  gray: 'bg-surface-active text-content-secondary',
  indigo: 'bg-accent-subtle text-accent-text',
  cyan: 'bg-cyan-500/20 text-cyan-300',
  teal: 'bg-teal-500/20 text-teal-300',
};

interface BadgeProps {
  label: string;
  color?: keyof typeof variants;
}

export function Badge({ label, color = 'gray' }: BadgeProps) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[color]}`}>
      {label}
    </span>
  );
}
