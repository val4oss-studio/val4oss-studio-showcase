# Localized 404 — `not-found.tsx` under `[locale]`

A 404 page that speaks the visitor's language and keeps the site chrome
(navbar, footer, background video), on a site whose **root layout lives inside
a dynamic segment** (`app/[locale]/layout.tsx`).

That last point is what makes this non-obvious. Next's own documentation names
the situation as a hard case:

> `global-not-found.js` is useful when you can't build a 404 page using a
> combination of `layout.js` and `not-found.js`. This can happen [when] your
> root layout is defined using top-level dynamic segments (e.g.
> `app/[country]/layout.tsx`), which makes composing a consistent 404 page
> harder.

This recipe builds it anyway, without the experimental flag. Portable — reusable
on any client site built on this stack.

Requires **Next.js ≥ 16.3.0** (for `next/root-params`).

---

## How it works

```
/nimportequoi
     ↓  proxy.ts — no locale prefix → redirect
/fr/nimportequoi
     ↓  routing: [locale]=fr ✓, no matching route
[locale]/[...slug]/page.tsx        ← catch-all, exists only to be reachable
     ↓  notFound()
[locale]/not-found.tsx             ← rendered INSIDE [locale]/layout.tsx
     ↓  locale read from next/root-params
getDictionary('fr') → styled 404, navbar + footer intact
```

Three pieces, none of which works without the other two: a **catch-all** to
make the boundary reachable, the **boundary** itself, and `next/root-params` to
get the locale into it.

---

## Design decisions

**The 404 is a Server Component, the error boundary is not.** `error.tsx` must
be a Client Component (React requires it), so it cannot call `getDictionary` —
which is marked `server-only`. Its copy lives in `src/config/errorPages.ts`.
`not-found.tsx` has no such constraint: it reads the dictionary like any other
page, and its copy belongs in `app/i18n/locales/*.json`. **Do not** move 404
strings into `errorPages.ts` for symmetry — that file is a workaround, not a
pattern.

**No `global-not-found.js`.** It is experimental, it bypasses the layout, and it
would mean maintaining a second complete HTML document — `<html>`, `<body>`,
its own `globals.css` import, its own fonts. The catch-all approach reuses the
real layout, so the 404 looks like the site for free. The cost is one blind spot
(see §6).

**No `app/not-found.tsx`.** A root `not-found.tsx` handles unmatched URLs
app-wide, but it renders in the root layout — which here is *below* `[locale]`,
so there is no layout for it to render in and no locale to read. It is the
wrong tool for this file structure.

---

## 1. The trap: `not-found.tsx` receives no props

This is the mistake everyone makes first, and it fails at runtime, not at
compile time:

```tsx
// ❌ Ne marche pas — `params` est toujours undefined
export default async function NotFound({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;   // TypeError: Cannot destructure … of 'undefined'
```

The Next docs state it flatly — *"`not-found.js` or `global-not-found.js`
components do not accept any props"* — and the source confirms it. In
`node_modules/next/dist/server/app-render/create-component-tree.js`:

```js
const element = Component ? createElement(Fragment, null, createElement(Component, null), styles) : undefined;
//                                                        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ no props, ever
```

TypeScript will not catch this: you are annotating a parameter that is simply
never supplied. The symptom is nasty — the 404 page throws, the throw is caught
by the sibling `error.tsx`, and the visitor sees **"Something went wrong"** on a
page that is merely missing.

The same applies to `error.tsx`, `loading.tsx`, `forbidden.tsx` and
`unauthorized.tsx`. Only `page.tsx` and `layout.tsx` get `params`.

---

## 2. Reading the locale — `next/root-params`

`[locale]` is the dynamic segment **above** the root layout, which makes it a
*root parameter*: shared by every route in the tree, and therefore readable from
any Server Component in it without prop drilling. The getter is named after the
folder — `[locale]` exports `locale`.

```tsx
import { locale as localeParam } from 'next/root-params';

const raw = await localeParam();                              // string
const locale = isValidLocale(raw) ? raw : defaultLocale;      // Locale
```

The getter is typed for you at `next dev` / `next build` time, in
`.next/types/root-params.d.ts`:

```ts
declare module 'next/root-params' {
  export function locale(): Promise<string>
}
```

It returns `string`, not your `Locale` union — hence the `isValidLocale` guard,
which also narrows the type for `getDictionary`.

**Limits worth knowing.** `next/root-params` works in Server Components only:
not in Client Components, not in Server Actions, not (yet) in Route Handlers,
and it throws inside `unstable_cache`. Segment names must be valid JS
identifiers, so `[post-slug]` is rejected outright.

> For a Client Component boundary such as `error.tsx`, `useParams()` is the
> equivalent — see `src/app/[locale]/error.tsx`.

---

## 3. The catch-all — why the boundary needs one

`not-found.tsx` renders when `notFound()` is **thrown during rendering**. A URL
that matches no route never reaches rendering at all: it 404s at the routing
layer, above every layout, and your boundary is never consulted.

So give the unmatched URLs a route to land on, whose only job is to throw:

```tsx
// src/app/[locale]/[...slug]/page.tsx
import { notFound } from 'next/navigation';
import type { JSX } from 'react';

export default function LocaleCatchAll(): JSX.Element {
  notFound();
}
```

`notFound()` is typed `never`, so the function type-checks as returning
`JSX.Element` without a `return`. More specific routes always beat a catch-all,
so `/fr/legal/cgv` is untouched — this file only ever sees what does not exist.

---

## 4. `dynamicParams = false` does **not** disable the catch-all

The root layout pins the valid locales:

```tsx
// src/app/[locale]/layout.tsx
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const dynamicParams = false;
```

At first glance this looks like it should kill the catch-all: `[...slug]` has no
`generateStaticParams`, so every `/fr/anything` ought to 404 at the routing
layer and never render. It does not, and the exception is a single clause in the
docs:

> When this config option is used, only paths provided by `generateStaticParams`
> will be served, and unspecified routes will 404 **or match (in the case of
> catch-all routes)**.

Catch-all segments are exempt. The two features compose exactly as wanted:

| Request | Outcome |
|---|---|
| `/fr`, `/en` | prerendered page |
| `/de` | 404 at routing layer — `dynamicParams = false` |
| `/fr/nimportequoi` | catch-all → `notFound()` → **styled 404** |
| `/fr/legal/cgv` | static MDX route wins over the catch-all |

Keep `dynamicParams = false`. Without it, a bogus first segment reaches
`[locale]/page.tsx` with an invalid locale and blows up in `getDictionary` — a
500 where a 404 was owed. The `isValidLocale` guard in the layout is then
belt-and-braces, and that is fine.

---

## 5. The page

Because it renders inside the layout, it emits a fragment — **no `<html>`, no
`<body>`, no `globals.css` import**. Everything the layout provides is already
on screen.

```tsx
// src/app/[locale]/not-found.tsx
import { locale as localeParam } from 'next/root-params';
import type { JSX } from 'react';
import { Button } from '@/app/component/ui';
import { getDictionary } from '@/app/i18n/translations';
import { defaultLocale, isValidLocale } from '@/config/locale';

export default async function NotFound(): Promise<JSX.Element> {
  const raw = await localeParam();
  const locale = isValidLocale(raw) ? raw : defaultLocale;
  const dict = await getDictionary(locale);

  return (
    <section className="section">
      <div className="bg-dots" aria-hidden="true" />
      <div className="bg-glow" aria-hidden="true" />

      <div className="section-container error-page">
        <p className="t-eyebrow">404</p>
        <h1 className="t-h1">{dict.notFound.title}</h1>
        <p className="t-body error-page-intro">{dict.notFound.description}</p>

        <div className="error-actions">
          <Button href={`/${locale}`} variant="primary">
            {dict.notFound.button}
          </Button>
        </div>
      </div>
    </section>
  );
}
```

The `404` eyebrow is deliberately not translated — it is a number.

The home link points at `/${locale}`, never `/`. A bare `/` costs the visitor a
round trip through `app/page.tsx` and the proxy redirect for no reason.

Copy goes in the dictionary, and `Dictionary` in `app/i18n/translations.ts`
enforces both locales at compile time:

```ts
notFound: {
  title:       string;
  description: string;
  button:      string;
};
```

**No `export const metadata`.** `not-found.tsx` does not support it (only
`global-not-found.js` does); the title comes from the layout's
`generateMetadata`. Next injects `<meta name="robots" content="noindex">`
automatically on 404 responses, so the SEO essential is already handled.

> **Decorative layers must not eat the click.** Every absolutely positioned
> `.bg-*` overlay needs `pointer-events: none`. `.bg-glow` is ~500 px, centred
> on the section, and `.section-container` is not positioned — without that one
> property it sits on top of the CTA and silently swallows every click. Easy to
> miss, because the Hero uses the same glow and has nothing clickable in it.

---

## 6. What this does not cover

**URLs whose first segment contains a dot.** `/wp-admin.php`, `/xmlrpc.php` and
the rest of the bot-probe catalogue are excluded from the proxy matcher, so they
are never given a locale prefix. `dynamicParams = false` then rejects them at the
routing layer — a correct 404, but Next's default screen rather than yours.

```
/en/foo.php   → catch-all → styled 404 ✓   (locale already present)
/foo.php      → routing 404 → default Next screen ✗
```

The only fix is `experimental.globalNotFound` plus a second full HTML document.
For a showcase site this is bot traffic; leaving it on the default screen is a
defensible trade.

**The HTTP status code.** `notFound()` yields a real `404` for non-streamed
responses and `200` for streamed ones — the status cannot change once streaming
has begun. Check what yours actually returns before assuming:

```bash
curl -sI https://studio.val4oss.com/fr/nimportequoi | head -1
```

If it reports `200`, the `noindex` tag still keeps the soft 404 out of search
results. To guarantee a hard `404`, the check has to run before the response
streams — i.e. in `proxy.ts`.

---

## 7. Adding this to a new site

1. `src/app/[locale]/[...slug]/page.tsx` — the four-line catch-all (§3).
2. `src/app/[locale]/not-found.tsx` — the boundary, locale via
   `next/root-params` (§5).
3. `app/i18n/locales/{fr,en}.json` — a `notFound` block, plus its shape on the
   `Dictionary` interface so a missing translation is a compile error.
4. Confirm `dynamicParams = false` and `generateStaticParams` are on the root
   layout (§4).
5. Verify: `/fr/zzz` and `/en/zzz` both show the styled page in the right
   language, and the CTA actually navigates.

---

## Anti-patterns

| Do NOT | Do instead |
|---|---|
| Type `params` on `not-found.tsx` | `next/root-params` — the component gets no props |
| `useParams()` in `not-found.tsx` | It is a Server Component; that hook needs `'use client'` |
| `next/root-params` in `error.tsx` | `useParams()` — root params are server-only |
| Render `<html>`/`<body>` in `not-found.tsx` | Fragment only; the layout owns the document |
| Import `globals.css` in `not-found.tsx` | The layout already did |
| Put 404 copy in `config/errorPages.ts` | The dictionary — the 404 *can* read it |
| `<Link href="/">` | `` <Link href={`/${locale}`}> `` — skip the redirect |
| Drop `dynamicParams = false` to "fix" the catch-all | Catch-alls are exempt from it |
| Skip the catch-all | Unmatched URLs never reach the boundary |
| `export const metadata` in `not-found.tsx` | Unsupported; the layout's metadata applies |
| An absolutely positioned `.bg-*` without `pointer-events: none` | It will swallow clicks |

---

## See also

- `docs/i18n.md` — locale routing, proxy, dictionaries
- `src/app/[locale]/error.tsx` — the sibling boundary, and why it is a Client
  Component
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/not-found.md`
- `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/next-root-params.md`
