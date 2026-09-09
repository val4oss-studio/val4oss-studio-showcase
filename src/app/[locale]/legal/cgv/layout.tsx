import type { ReactNode } from 'react';
import { createLegalMetadata } from '@/app/[locale]/legal/legalMetadata';

/* Ce layout ne rend rien de plus : il ne porte que les métadonnées du document. */
export const generateMetadata = createLegalMetadata('terms');

export default function TermsLayout({ children }: { children: ReactNode }): ReactNode {
  return children;
}
