# Markdown pages (MDX) — legal documents

Long-form static content — legal notice, privacy policy, terms — authored as
markdown files that are routed directly by the App Router. No CMS, no database,
no runtime parsing: the markdown **is** the page, compiled at build time.

Portable recipe — reusable on any client site built on this stack.

---

## How it works

```
src/app/[locale]/legal/cgv/page.mdx        ← the document, plain markdown
                    ↓  @next/mdx + remark-gfm (build time)
                 React tree
                    ↓  src/mdx-components.tsx
        <h2 class="t-h2">, <p class="t-body">, <table class="legal-table">
                    ↓  [locale]/legal/layout.tsx
        <article class="legal-prose" lang="fr">
```

Two routes per document (`/fr/legal/cgv`, `/en/legal/cgv`), both prerendered as
static HTML by the parent `generateStaticParams`. Zero client JS.

---

## Design decisions

**MDX is a superset of markdown.** There is no conversion step: a `.md` file is
already valid MDX. Porting = renaming to `.mdx` + escaping a few characters
(see §7).

**The documents are not translated.** They are written in French and served
under every interface locale. This is what makes file-based routing viable: a
single physical `page.mdx` lives *under* the dynamic `[locale]` segment and
serves both languages. Were the documents translated, a `page.mdx` per locale
would collide with `[locale]` and the whole approach would collapse — the
fallback would then be a `[slug]` route reading `.md` files with `remark`.

**Consequences of serving French under `/en`:** the document body carries
`lang="fr"` (set on `<article>` by the layout) even when `<html lang="en">`,
and every canonical points at the French URL so search engines see one document,
not two. Only the *link labels* are translated, from the dictionary.

---

## 1. Dependencies

```bash
npm install @next/mdx @mdx-js/loader @mdx-js/react @types/mdx remark-gfm
```

`remark-gfm` is **not optional** here: base MDX is CommonMark, which has no
tables. Every legal document in this project uses them.

---

## 2. File structure

```
src/
├── mdx-components.tsx                  # REQUIRED by @next/mdx — tag → class mapping
├── config/
│   └── legal.ts                        # slugs, SEO descriptions, source-of-truth
└── app/
    └── [locale]/
        └── legal/
            ├── layout.tsx              # shared wrapper: .legal-prose + lang="fr"
            ├── legalMetadata.ts        # generateMetadata factory
            ├── cgv/
            │   ├── page.mdx            # ← the document
            │   └── layout.tsx          # metadata only
            ├── mention-legales/
            │   ├── page.mdx
            │   └── layout.tsx
            └── politique-de-confidentialite/
                ├── page.mdx
                └── layout.tsx
```

---

## 3. `next.config.ts`

```ts
import createMDX from '@next/mdx';

const nextConfig: NextConfig = {
  pageExtensions: ['ts', 'tsx', 'mdx'],
  // … rest unchanged
};

const withMDX = createMDX({
  options: {
    remarkPlugins: ['remark-gfm'],
  },
});

export default withMDX(nextConfig);
```

> Plugins are declared **by name, as strings**. Turbopack is written in Rust and
> cannot receive JavaScript functions, so `remarkPlugins: [remarkGfm]` (an
> import) silently fails to cross the bridge.

---

## 4. `src/mdx-components.tsx` — the styling contract

Required by `@next/mdx`; the App Router will not render `.mdx` without it.
It maps generated tags onto the **existing** `t-*` utilities — no new
typographic scale is introduced.

```tsx
const components = {
  h2: (props: ComponentPropsWithoutRef<'h2'>): JSX.Element => (
    <h2 className="t-h2" {...props} />
  ),
  // h1, h3, h4, p, li, a, code …
  table: (props: ComponentPropsWithoutRef<'table'>): JSX.Element => (
    <div className="legal-table-scroll">
      <table className="legal-table" {...props} />
    </div>
  ),
} satisfies MDXComponents;

export function useMDXComponents(): MDXComponents {
  return components;
}
```

Split of responsibilities:

| Concern | Where |
|---|---|
| Typography (family, size, weight, colour) | `t-*` utilities, via this file |
| Vertical rhythm, lists, rules, tables | `.legal-prose` in `globals.css` |

> **Layer precedence trap.** `@utility t-*` generates into Tailwind's
> `utilities` layer, which wins over `@layer components`. A rule such as
> `.legal-prose p { color: … }` is therefore **dead** — `t-body` already sets
> `color`. From `.legal-prose`, only ever set properties no `t-*` touches
> (margin, padding, background, border, list-style).

---

## 5. Metadata — why it is not in the `.mdx`

`@next/mdx` compiles the document outside the server layer, so Next rejects a
`metadata` export from a `page.mdx`:

```
You are attempting to export "metadata" from a component marked with "use client"
```

Each document therefore has a minimal `layout.tsx` that renders nothing extra
and exists solely to carry its metadata:

```tsx
export const generateMetadata = createLegalMetadata('terms');

export default function TermsLayout({ children }: { children: ReactNode }): ReactNode {
  return children;
}
```

`createLegalMetadata` (in `legalMetadata.ts`) builds a localised tab title from
the dictionary, a French description from `config/legal.ts`, and a canonical
pointing at the French URL. This is strictly better than the YAML frontmatter
it replaces — frontmatter could not have produced a locale-aware title.

> `@next/mdx` does **not** support YAML frontmatter. A `---` block at the top of
> a document is rendered as visible content (a horizontal rule followed by raw
> `title: …` text). Never leave one in.

---

## 6. Adding a new document

1. `src/config/legal.ts` → add the key + slug to `LEGAL_DOC_SLUGS`, and its
   description to `LEGAL_DOC_DESCRIPTIONS`.
2. `src/app/[locale]/legal/<slug>/page.mdx` → drop the markdown in.
3. `src/app/[locale]/legal/<slug>/layout.tsx` → copy an existing one, change the
   key passed to `createLegalMetadata`.
4. `app/i18n/locales/{fr,en}.json` → add the link label under
   `footer.legal.links`.

The footer links and the sitemap derive from `LEGAL_DOC_SLUGS` — nothing else
to touch. TypeScript enforces steps 1 and 4 together: `Dictionary` types the
labels as `Record<LegalDocKey, string>`, so a missing label is a compile error.

---

## 7. Porting a `.md` file to `.mdx`

Renaming is the whole job, but MDX treats `<` and `{` as code. Four things
break, in order of likelihood on a legal document:

| Breaks | Fix |
|---|---|
| YAML frontmatter (`---` block) | Delete it — metadata lives in `layout.tsx` |
| Autolinks: `<contact@val4oss.com>` | `[contact@val4oss.com](mailto:…)` |
| Placeholders: `{{SIRET}}`, `{montant}` | Replace, or escape as `\{` |
| Raw HTML: `<br>`, `class=` | `<br />`, `className=` (JSX rules) |

Fenced code blocks are exempt — MDX parses nothing inside them.

Scan a document before renaming it:

````bash
awk '/^```/{f=!f;next} !f && (/^---[[:space:]]*$/ || /<[A-Za-z\/!]/ || /\{/) \
  {print FILENAME":"FNR": "$0}' path/to/*.md
````

Do this **once**, by hand, and commit the result. Do not add a build step that
rewrites `.md` into `.mdx`: it would generate files inside the routing tree,
which then have to be gitignored, are not regenerated on the fly by `next dev`,
and make every compile error point at a generated file.

---

## Anti-patterns

| Do NOT | Do instead |
|---|---|
| `export const metadata` in a `page.mdx` | `generateMetadata` in the sibling `layout.tsx` |
| YAML frontmatter | `config/legal.ts` + `createLegalMetadata` |
| A `page.mdx` per locale | One document under `[locale]`, `lang="fr"` + canonical |
| Tailwind Typography / a new type scale | `t-*` utilities via `mdx-components.tsx` |
| Redefine a `t-*` property from `.legal-prose` | Only set what no utility sets |
| `remarkPlugins: [remarkGfm]` (imported) | `remarkPlugins: ['remark-gfm']` (string) |
| Hard-code a legal URL in the footer | `legalDocHref(locale, key)` |
| Omit `remark-gfm` | Markdown tables silently disappear |
