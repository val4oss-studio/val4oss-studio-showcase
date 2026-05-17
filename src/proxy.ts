import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { locales, defaultLocale } from '@/config/locale';

/**
 * Détermine la locale préférée depuis le header Accept-Language.
 * Retourne defaultLocale si aucune locale supportée n'est trouvée.
 */
function getLocale(request: NextRequest): string {
  const acceptLang = request.headers.get('accept-language') ?? '';
  // Negotiator attend un objet plain, pas un Headers
  const headers = { 'accept-language': acceptLang };
  const languages = new Negotiator({ headers }).languages();

  try {
    // match() retourne la meilleure locale supportée
    return match(languages, [...locales], defaultLocale);
  } catch {
    // Aucun match : fallback sur la locale par défaut
    return defaultLocale;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // L'URL a déjà une locale → laisser passer sans modification
  const pathnameHasLocale = locales.some(
    (locale) =>
      pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return NextResponse.next();

  // Détecter et préfixer la locale
  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    /*
     * Intercepter tout sauf :
     * - _next/static  (assets compilés)
     * - _next/image   (optimisation images)
     * - favicon.ico
     * - Fichiers statiques (images, fonts, svg, webp…)
     */
    /*'/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf|otf|eot)$).*)',*/
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.[^/]+$).*)',
  ],
};
