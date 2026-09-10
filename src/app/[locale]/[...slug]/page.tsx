import { notFound } from 'next/navigation';
import type { JSX } from 'react';

/*
 * Attrape-tout du sous-arbre [locale] : il n'existe que pour rendre la
 * frontière `not-found.tsx` atteignable.
 *
 * Sans lui, `/fr/nimportequoi` ne correspond à aucune route et sort en 404 au
 * niveau du routage, avant tout rendu — donc sans layout, et sans jamais
 * traverser `not-found.tsx`. En passant par une route qui matche puis lève
 * `notFound()`, la 404 est rendue dans le layout, avec navbar et footer.
 *
 * Les routes plus spécifiques (`/fr/legal/cgv`…) gagnent toujours contre un
 * catch-all : ce fichier ne capture que ce qui n'existe pas.
 */
export default function LocaleCatchAll(): JSX.Element {
  notFound();
}
