import type { JSX, ReactNode } from 'react';

interface SectionTitleProps {
  children: ReactNode  // main title text
  accent?: string            // optional last line in gold — omit for plain title
  className?: string
}

export function SectionTitle({
  children,
  accent,
  className = '' 
}: SectionTitleProps): JSX.Element {
  return (
    <h2 className={`section-title t-h2 ${className}`.trim()}>
      {children}
      {accent && (
        <>
          <br />
          <span className="t-accent">{accent}</span>
        </>
      )}
    </h2>
  )
}
