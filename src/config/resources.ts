/*
 * Ressources externes — source de vérité unique.
 *
 * Services hébergés sur leurs propres sous-domaines, hors de l'application
 * Next : ils ne passent donc jamais par le routage ni par `next/link`.
 * Chaque clé correspond à une entrée `footer.resources.links` du dictionnaire.
 * Ajouter une ressource : une ligne ici et son libellé dans les deux JSON —
 * `Record<ResourceKey, string>` fait échouer la compilation si l'un manque.
 */
export const RESOURCE_URLS = {
  forum:    'https://forum.val4oss.com',
  feedback: 'https://feedback.val4oss.com',
} as const;

export type ResourceKey = keyof typeof RESOURCE_URLS;

export const RESOURCE_KEYS = Object.keys(RESOURCE_URLS) as ResourceKey[];
