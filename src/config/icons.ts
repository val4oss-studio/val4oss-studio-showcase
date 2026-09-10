export const ICON_KEYS = [
  'server', 'workspace', 'open-source',
  'code', 'currency-euro', 'lock', 'layout-dashboard',
  'browser', 'rocket', 'star', 'shield-check', 'crown',
  'mail', 'instagram', 'matrix', 'github', 'language',
  'chevron-down',
] as const;

export type IconKey = typeof ICON_KEYS[number];
