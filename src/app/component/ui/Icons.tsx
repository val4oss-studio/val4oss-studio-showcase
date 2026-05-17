/*
 * Icons — inline SVG resolver following the getPillarIcon() pattern
 * established in AboutSectionClient.tsx.
 *
 * Paths approximate Tabler Icons (24×24 viewBox, stroke-width 1.5).
 * All icons use `stroke="currentColor"` — color is controlled via CSS.
 */

import type { JSX } from 'react';

// --- Icon components ---

/* Server rack — hosting pillar */
function ServerIcon(): JSX.Element {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="3" width="20" height="7" rx="2" />
      <rect x="2" y="14" width="20" height="7" rx="2" />
      <circle cx="6" cy="6.5" r="0.5" fill="currentColor" />
      <circle cx="6" cy="17.5" r="0.5" fill="currentColor" />
    </svg>
  );
}

/* App grid — client workspace pillar */
function WorkspaceIcon(): JSX.Element {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

/* Code brackets — open-source pillar */
function OpenSourceIcon(): JSX.Element {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function CodeIcon(): JSX.Element {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <polyline points="7 8 3 12 7 16" />
      <polyline points="17 8 21 12 17 16" />
      <line x1="14" y1="4" x2="10" y2="20" />
    </svg>
  );
}

function CurrencyEuroIcon(): JSX.Element {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <path d="M17.2 7a6 6 0 1 0 0 10" />
      <path d="M13 10h-8" />
      <path d="M13 14h-8" />
    </svg>
  );
}

function LockIcon(): JSX.Element {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <circle cx="12" cy="16" r="1" fill="currentColor" stroke="none" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

function LayoutDashboardIcon(): JSX.Element {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <rect x="3" y="3" width="6" height="10" rx="2" />
      <rect x="13" y="3" width="8" height="4" rx="2" />
      <rect x="13" y="11" width="8" height="9" rx="2" />
      <rect x="3" y="17" width="6" height="4" rx="2" />
    </svg>
  );
}

 function BrowserIcon(): JSX.Element {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18" />
      <path d="M9 3v6" />
    </svg>
  );
}

function RocketIcon(): JSX.Element {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <path d="M4 13a8 8 0 0 1 7 7 6 6 0 0 0 3 -5 9 9 0 0 0 6 -8 3 3 0 0 0 -3 -3 9 9 0 0 0 -8 6 6 6 0 0 0 -5 3" />
      <path d="M7 14a6 6 0 0 0 -3 6 6 6 0 0 0 6 -3" />
      <circle cx="15" cy="9" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function StarIcon(): JSX.Element {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <path d="M12 17.75l-6.172 3.245 1.179-6.873-5-4.867 6.9-1 3.086-6.253 3.086 6.253 6.9 1-5 4.867 1.179 6.873z" />
    </svg>
  );
}

function ShieldCheckIcon(): JSX.Element {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <path d="M12 3a12 12 0 0 0 8.5 3 12 12 0 0 1 -8.5 15 12 12 0 0 1 -8.5 -15 12 12 0 0 0 8.5 -3" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function CrownIcon(): JSX.Element {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <path d="M12 6l4 6 5-4-2 10H5L3 8l5 4z" />
    </svg>
  );
}

// --- Resolver ---

type IconKey =
  | 'server' | 'workspace' | 'open-source'
  | 'code' | 'currency-euro' | 'lock' | 'layout-dashboard'
  | 'browser' | 'rocket' | 'star'
  | 'shield-check' | 'crown';

const ICON_MAP: Record<IconKey, () => JSX.Element> = {
  'server':            ServerIcon,
  'workspace':         WorkspaceIcon,
  'open-source':       OpenSourceIcon,
  'code':              CodeIcon,
  'currency-euro':     CurrencyEuroIcon,
  'lock':              LockIcon,
  'layout-dashboard':  LayoutDashboardIcon,
  'browser':           BrowserIcon,
  'rocket':            RocketIcon,
  'star':              StarIcon,
  'shield-check':      ShieldCheckIcon,
  'crown':             CrownIcon,
};

/**
 * Returns the icon component for a given key, or null if unknown.
 * Follows the getPillarIcon() pattern in AboutSectionClient.tsx.
 */
export function getIcon(key: string): (() => JSX.Element) | null {
  return ICON_MAP[key as IconKey] ?? null;
}
