export interface ProjectConfig {
  id:          string;
  url:         string;
  screenshot:  string;
  tags:        string[];
}

export const PROJECTS: ProjectConfig[] = [
  {
    id: 'theboweryst',
    url: 'https://theboweryst.fr',
    screenshot: '/projects/theboweryst.webp',
    tags:['Nextjs', 'themes', 'i18n', 'seo', 'googleIndexing', 'dynamic'],
  },
  {
    id: 'example-barber',
    url: 'https://studio.val4oss.com',
    screenshot: '/projects/example.webp',
    tags:['Nextjs', 'saas'],
  },
  {
    id: 'example-ecom',
    url: 'https://studio.val4oss.com',
    screenshot: '/projects/example.webp',
    tags:['Nextjs', 'ecommerce'],
  },
];
