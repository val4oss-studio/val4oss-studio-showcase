import type { ReactNode } from 'react';
import { createLegalMetadata } from '@/app/[locale]/legal/legalMetadata';

/* Ce layout ne rend rien de plus : il ne porte que les métadonnées du document. */
export const generateMetadata = createLegalMetadata('legalNotice');

export default function LegalNoticeLayout({ children }: { children: ReactNode }): ReactNode {
  return children;
}
