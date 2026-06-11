export interface ContactChannel {
  id:     string;
  icon:   string;   // clé pour getIcon()
  href:   string;   // lien réel (mailto:, https://)
  handle: string;   // adresse visible sur la carte
}

export const CONTACT_CHANNELS: ContactChannel[] = [
  {
    id:     'email',
    icon:   'mail',
    href:   'mailto:contact@val4oss.com',
    handle: 'contact@val4oss.com',
  },
  {
    id:     'instagram',
    icon:   'instagram',
    href:   'https://www.instagram.com/val4oss',
    handle: '@val4oss',
  },
  {
    id:     'matrix',
    icon:   'matrix',
    href:   'https://matrix.to/#/@keentux:matrix.org',
    handle: '@keentux:matrix.org',
  },
];
