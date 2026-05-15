import type { ReactNode } from 'react';

export const SPEC_LINE_SEPARATOR = '||';

export const splitSpecLines = (value?: string | null): string[] => {
  if (!value) return [];

  return value
    .split(SPEC_LINE_SEPARATOR)
    .map((line) => line.trim())
    .filter(Boolean);
};

interface SpecValueProps {
  value?: string | null;
  className?: string;
  bulletClassName?: string;
  renderSingleLine?: (value: string) => ReactNode;
}

const SpecValue = ({
  value,
  className = '',
  bulletClassName = 'marker:text-current',
  renderSingleLine,
}: SpecValueProps) => {
  const lines = splitSpecLines(value);

  if (lines.length === 0) return null;

  if (lines.length === 1) {
    return <>{renderSingleLine ? renderSingleLine(lines[0]) : lines[0]}</>;
  }

  return (
    <ul className={`list-disc pl-5 space-y-1 ${className}`}>
      {lines.map((line, index) => (
        <li key={`${line}-${index}`} className={bulletClassName}>
          {line}
        </li>
      ))}
    </ul>
  );
};

export default SpecValue;
