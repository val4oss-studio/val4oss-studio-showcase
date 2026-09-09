/*
 * Icons — pictogrammes SVG inline, viewBox 24×24.
 *
 * Chaque entrée ne porte que ses éléments graphiques ; le <svg> englobant
 * est construit une seule fois par le composant Icon.
 * Tracés inspirés de Tabler Icons (stroke-width 1.5).
 *
 * La taille est pilotée par le CSS (.icon), jamais par le JSX.
 */

import type { JSX, ReactNode, SVGProps } from 'react';
import type { IconKey } from '@/config/icons';

/* Pictogramme au trait — le cas général */
const STROKE: SVGProps<SVGSVGElement> = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

/* Logo plein — pas de contour */
const FILLED: SVGProps<SVGSVGElement> = {
  fill: 'currentColor',
};

interface IconDef {
  paths: ReactNode;
  /** true pour un logo plein (fill) au lieu d'un tracé au trait */
  filled?: boolean;
}

const ICONS: Record<IconKey, IconDef> = {
  'server': { paths: (
    <>
      <rect x="2" y="3" width="20" height="7" rx="2" />
      <rect x="2" y="14" width="20" height="7" rx="2" />
      <circle cx="6" cy="6.5" r="0.5" fill="currentColor" />
      <circle cx="6" cy="17.5" r="0.5" fill="currentColor" />
    </>
  )},

  'workspace': { paths: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </>
  )},

  'open-source': { paths: (
    <>
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </>
  )},

  'code': { paths: (
    <>
      <polyline points="7 8 3 12 7 16" />
      <polyline points="17 8 21 12 17 16" />
      <line x1="14" y1="4" x2="10" y2="20" />
    </>
  )},

  'currency-euro': { paths: (
    <>
      <path d="M17.2 7a6 6 0 1 0 0 10" />
      <path d="M13 10h-8" />
      <path d="M13 14h-8" />
    </>
  )},

  'lock': { paths: (
    <>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <circle cx="12" cy="16" r="1" fill="currentColor" stroke="none" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </>
  )},

  'layout-dashboard': { paths: (
    <>
      <rect x="3" y="3" width="6" height="10" rx="2" />
      <rect x="13" y="3" width="8" height="4" rx="2" />
      <rect x="13" y="11" width="8" height="9" rx="2" />
      <rect x="3" y="17" width="6" height="4" rx="2" />
    </>
  )},

  'browser': { paths: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18" />
      <path d="M9 3v6" />
    </>
  )},

  'rocket': { paths: (
    <>
      <path d="M4 13a8 8 0 0 1 7 7 6 6 0 0 0 3 -5 9 9 0 0 0 6 -8 3 3 0 0 0 -3 -3 9 9 0 0 0 -8 6 6 6 0 0 0 -5 3" />
      <path d="M7 14a6 6 0 0 0 -3 6 6 6 0 0 0 6 -3" />
      <circle cx="15" cy="9" r="1" fill="currentColor" stroke="none" />
    </>
  )},

  'star': { paths: (
    <path d="M12 17.75l-6.172 3.245 1.179-6.873-5-4.867 6.9-1 3.086-6.253 3.086 6.253 6.9 1-5 4.867 1.179 6.873z" />
  )},

  'shield-check': { paths: (
    <>
      <path d="M12 3a12 12 0 0 0 8.5 3 12 12 0 0 1 -8.5 15 12 12 0 0 1 -8.5 -15 12 12 0 0 0 8.5 -3" />
      <path d="M9 12l2 2 4-4" />
    </>
  )},

  'crown': { paths: (
    <path d="M12 6l4 6 5-4-2 10H5L3 8l5 4z" />
  )},

  'mail': { paths: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <polyline points="3 7 12 13 21 7" />
    </>
  )},

  'instagram': { paths: (
    <>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </>
  )},

  /* Logo Matrix : crochets [ m ] */
  'matrix': { paths: (
    <>
      <path d="M7 4H4v16h3" />        {/* crochet gauche [ */}
      <path d="M17 4h3v16h-3" />      {/* crochet droit ] */}
      <path d="M8 15V9l4 4 4-4v6" />  {/* lettre m */}
    </>
  )},

  /* Globe — bascule de langue */
  'language': { paths: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3.6 9h16.8" />
      <path d="M3.6 15h16.8" />
      <path d="M11.5 3a17 17 0 0 0 0 18" />
      <path d="M12.5 3a17 17 0 0 1 0 18" />
    </>
  )},

  /* GitHub mark — logo plein, pas de contour */
  'github': { filled: true, paths: (
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.5311.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.9881.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.2962.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.8550 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  )},
};

export function Icon({ name }: { name: IconKey }): JSX.Element {
  const { paths, filled } = ICONS[name];

  return (
    <svg
      className="icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
      {...(filled ? FILLED : STROKE)}
    >
      {paths}
    </svg>
  );
}
