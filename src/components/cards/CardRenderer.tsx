// Dependencies: SyntaxHighlighter, vscDarkPlus — see DEPENDENCY_GUIDE.md
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { CardType } from '../../types/card';

const typeConfig: Record<CardType, { label: string; description: string; color: string }> = {
  STANDARD: { label: 'Standard', description: 'Classic question and answer flashcard', color: 'bg-blue-500/20 text-blue-300' },
  CODE_OUTPUT: { label: 'Code Output', description: 'Given code, predict what it outputs', color: 'bg-green-500/20 text-green-300' },
  SPOT_THE_BUG: { label: 'Spot the Bug', description: 'Find the error in the code snippet', color: 'bg-red-500/20 text-red-300' },
  FILL_BLANK: { label: 'Fill in the Blank', description: 'Complete the missing part of a statement', color: 'bg-yellow-500/20 text-yellow-300' },
  EXPLAIN_WHEN: { label: 'Explain When', description: 'Explain when or why you would use something', color: 'bg-purple-500/20 text-purple-300' },
  COMPARE: { label: 'Compare', description: 'Compare and contrast two or more concepts', color: 'bg-orange-500/20 text-orange-300' },
};

/** Extracts the language tag from a code block opening (e.g. "java" from "```java"). */
function extractLang(raw: string): string {
  const match = raw.slice(3).match(/^(\w+)/);
  return match ? match[1] : 'java';
}

/** Renders text with inline `code`, ```code blocks```, and **bold** styled properly. */
function renderContent(text: string) {
  const blockParts = text.split(/(```[\s\S]*?```)/g);

  return blockParts.map((part, i) => {
    if (part.startsWith('```') && part.endsWith('```')) {
      const lang = extractLang(part);
      const inner = part.slice(3, -3).replace(/^\w*\n?/, '');
      return (
        <SyntaxHighlighter
          key={i}
          language={lang}
          style={vscDarkPlus}
          customStyle={{ margin: '0.5rem 0', borderRadius: '0.5rem', fontSize: '22px', lineHeight: '1.5' }}
          codeTagProps={{ style: { fontSize: '22px' } }}
          showLineNumbers
        >
          {inner.trim()}
        </SyntaxHighlighter>
      );
    }

    const inlineParts = part.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
    return (
      <span key={i}>
        {inlineParts.map((seg, j) => {
          if (seg.startsWith('`') && seg.endsWith('`')) {
            return (
              <code key={j} className="rounded bg-surface-active px-1.5 py-0.5 font-mono text-sm text-indigo-300">
                {seg.slice(1, -1)}
              </code>
            );
          }
          if (seg.startsWith('**') && seg.endsWith('**')) {
            return (
              <strong key={j} className="font-bold text-amber-300">
                {seg.slice(2, -2)}
              </strong>
            );
          }
          return <span key={j}>{seg}</span>;
        })}
      </span>
    );
  });
}

interface CardRendererProps {
  front: string;
  back?: string;
  cardType: CardType;
  hint?: string | null;
  showBack?: boolean;
}

export function CardRenderer({ front, back, cardType, hint, showBack = false }: CardRendererProps) {
  return (
    <div>
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${typeConfig[cardType].color}`}>
        {typeConfig[cardType].label}
      </span>
      <div className="mt-2 text-content">
        {renderContent(front)}
      </div>
      {hint && !showBack && (
        <p className="mt-2 text-sm italic text-content-faint">Hint: {hint}</p>
      )}
      {showBack && back && (
        <div className="mt-4 border-t border-line pt-4">
          <span className="text-xs font-medium uppercase tracking-wider text-content-faint">Answer</span>
          <div className="mt-2 text-content">
            {renderContent(back)}
          </div>
        </div>
      )}
    </div>
  );
}
