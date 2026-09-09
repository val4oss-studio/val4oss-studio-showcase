import type { ComponentPropsWithoutRef, JSX } from 'react';
import type { MDXComponents } from 'mdx/types';

/*
 * Mapping global des balises produites par MDX vers le design system.
 *
 * La typographie réutilise les utilitaires `t-*` de globals.css — aucune
 * échelle typographique n'est réintroduite ici. Le rythme vertical, les
 * listes, les filets et les tableaux sont pris en charge par `.legal-prose`
 * (voir le layout des pages légales), pour garder ce fichier déclaratif.
 *
 * Requis par @next/mdx : sans ce fichier, l'App Router ne rend pas les .mdx.
 */
const components = {
  h1: (props: ComponentPropsWithoutRef<'h1'>): JSX.Element => (
    <h1 className="t-h1" {...props} />
  ),
  h2: (props: ComponentPropsWithoutRef<'h2'>): JSX.Element => (
    <h2 className="t-h2" {...props} />
  ),
  h3: (props: ComponentPropsWithoutRef<'h3'>): JSX.Element => (
    <h3 className="t-h3" {...props} />
  ),
  h4: (props: ComponentPropsWithoutRef<'h4'>): JSX.Element => (
    <h4 className="t-h4" {...props} />
  ),
  p: (props: ComponentPropsWithoutRef<'p'>): JSX.Element => (
    <p className="t-body" {...props} />
  ),
  li: (props: ComponentPropsWithoutRef<'li'>): JSX.Element => (
    <li className="t-body" {...props} />
  ),
  a: (props: ComponentPropsWithoutRef<'a'>): JSX.Element => (
    <a className="t-link" {...props} />
  ),
  code: (props: ComponentPropsWithoutRef<'code'>): JSX.Element => (
    <code className="t-mono" {...props} />
  ),

  /* Les tableaux légaux (identité, durées de conservation…) débordent sur
     mobile : ils défilent dans leur propre conteneur, jamais la page. */
  table: (props: ComponentPropsWithoutRef<'table'>): JSX.Element => (
    <div className="legal-table-scroll">
      <table className="legal-table" {...props} />
    </div>
  ),
} satisfies MDXComponents;

export function useMDXComponents(): MDXComponents {
  return components;
}
