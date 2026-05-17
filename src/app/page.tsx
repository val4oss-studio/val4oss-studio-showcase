import { redirect } from 'next/navigation';
import { defaultLocale } from '@/config/locale';

/**
 * Fallback if proxy doesn't executes (static build, tests, etc.)
 * In production, proxy redirect before this page.
 */
export default function RootPage() {
  redirect(`/${defaultLocale}`);
}
