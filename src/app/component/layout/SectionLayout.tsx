import type { ReactNode } from 'react';

interface SectionLayoutProps {
  id: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  children: ReactNode;
}

export function SectionLayout({
  id,
  eyebrow,
  title,
  subtitle,
  children,
}: SectionLayoutProps) {
  return (
    <section id={id} className="section">
      <div className="section-container">
        {(eyebrow || title || subtitle) && (
          <div className="section-header">
            {eyebrow && (
              <p className="section-eyebrow t-eyebrow">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="section-title t-h2">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="section-subtitle t-caption max-w-2xl">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
