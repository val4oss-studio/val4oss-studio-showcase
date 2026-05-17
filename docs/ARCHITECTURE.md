# Clean Architecture -- Next.js 16+ / SQLite

Showcase website with light SQLite backend. Three layers:
**Domain** (business logic, zero deps) > **Data** (persistence, SQLite) > **App** (UI, Next.js).

---

## Dependency Rule

```
  app/     ──imports──>  domain/  <──implements──  data/
  scripts/ ──imports──>  domain/
  (UI)                   (business)                (persistence)

  validators/   used by app/ at system boundaries (forms, API routes)
  config/       used by all layers (env, constants, site metadata)
```

Inner layers never import from outer layers.
* `domain/` imports nothing.
* `app/` never imports from `data/`.

---

## Directory Structure

```
src/
├── domain/
│   ├── entity/
│   │   └── [entity]Entity.ts
│   ├── service/
│   │   └── [entity]Service.ts
│   └── error/
│       ├── notFoundError.ts
│       └── validationError.ts
│
├── data/
│   ├── model/
│   │   └── [entity]Model.ts
│   ├── mapper/
│   │   └── [entity]Mapper.ts
│   ├── repository/
│   │   └── [entity]Repository.ts
│   ├── adapter/
│   │   └── [service]Adapter.ts       #   External integrations (email, storage)
│   └── db/
│       ├── client.ts                 #   Singleton connection (WAL, FK, auto-migrate)
│       ├── config.ts                 #   Paths + env vars
│       ├── migrations.ts             #   Migration runner
│       ├── migration/
│       │   └── NNN_[description].sql
│       └── script/                  # DB infrastructure only (migration, seed, reset)
│           ├── migrate.ts
│           ├── seed.ts
│           └── reset.ts
│
├── script/                           # CLI entrypoints (per-entity CRUD)
│   └── [entity]                      # Calls domain services + vlidators.
│
├── validator/
│   └── [entity]Validator.ts          # Zod schemas + inferred TS types
│
├── config/
│   ├── locale.ts                    # Locale type, LocalizedText, locales[], defaultLocale
│   ├── env.ts                        # Environment variables
│   ├── constant.ts                  # App-wide constants
│   └── site.ts                       # Site metadata (name, URL, socials)
│
├── app/                              # Next.js App Router (UI layer)
│   ├── layout.tsx                    #   Root shell (fonts, global scripts, JSON-LD SEO)
│   ├── page.tsx                      #   Redirect → /{defaultLocale}
│   ├── not-found.tsx
│   ├── error.tsx                     #   Error boundary ("use client")
│   ├── loading.tsx
│   ├── globals.css
│   │
│   ├── [locale]/                     #   Localized routes (/fr, /en, …)
│   │   ├── layout.tsx                #     I18nProvider + locale metadata (hreflang, title, canonical)
│   │   ├── page.tsx                  #     Main page — composition only, zero logic
│   │   └── [feature]/
│   │       └── page.tsx              #     Secondary pages (e.g.: /fr/artists, /en/artists)
│   │
│   ├── api/                          #   Route Handlers (REST)
│   │   └── [entity]/
│   │       ├── route.ts              #     GET (list), POST (create)
│   │       └── [id]/
│   │           └── route.ts          #     GET, PUT, DELETE
│   │
│   ├── component/
│   │   ├── layout/                   #   Navbar, Footer, Header... + index.ts
│   │   ├── section/                  #   [Name]Section.tsx + atomic children + index.ts
│   │   ├── ui/                       #   Button, Card, Modal, Input... + index.ts
│   │   └── form/                     #   [Entity]Form.tsx + index.ts
│   │
│   ├── hook/                         #   useTheme, useLocale, useScrollPosition…
│   ├── provider/                     #   ThemeProvider (I18nProvider lives in [locale]/layout.tsx)
│   └── i18n/
│       ├── config.ts                 #   Display names and flags per locale
│       ├── provider.tsx              #   I18nProvider — receives initialLocale from URL
│       ├── translations.ts           #   getTranslations(locale)
│       └── locales/                  #   en.json, fr.json…
│
├── middleware.ts                      # Locale redirect, security headers
│
public/                               # Static assets
database/                             # SQLite files (gitignored)
test/                                 # Mirrors src/ structure
```

---

## Domain Layer (`src/domain/`)

Pure TypeScript. No framework, no DB, no external library.

### Entities

Business-shaped interfaces (no `createdAt`/`updatedAt`) + pure domain functions.
No imports.

```typescript
// domain/entity/[entity]Entity.ts

export interface [Entity]Entity {
  id: number;
  name: string;
  description: string;
  imageUrl?: string;
}

export interface Create[Entity]Data {...}
export type Update[Entity]Data = Partial<Create[Entity]Data>;

// Pure function -- business rule
export function get[Entity]Image(entity: [Entity]Entity): string {
  return entity.imageUrl ?? '/images/default.jpg';
}

```

### Services

Use cases. Call repositories, return entities. No framework code.

```typescript
// domain/service/[entity]Service.ts

import { [Entity]Repository } from '@/data/repositories/[entity]Repository';
import type { [Entity]Entity } from '@/domain/entities/[entity]Entity';

export function getAll[Entity]s(): [Entity]Entity[] {
  return new [Entity]Repository().findAll();
}

export function get[Entity]ById(id: number): [Entity]Entity | null {
  return new [entity]Repository().findById(id) ?? null;
}
```

### Errors

Typed domain errors caught at API/component level.

```typescript
// domain/error/notFoundError.ts
export class NotFoundError extends Error {
  constructor(entity: string, id: string | number) {
    super(`${entity} not found: ${id}`);
    this.name = 'NotFoundError';
  }
}
```

---

## Data Layer (`src/data/`)

All persistence. SQLite via better-sqlite3. Implements the data access the domain needs.

### Model vs Entity

| Concern       | Model (`data/model/`)              | Entity (`domain/entity/`)       |
|---------------|-------------------------------------|-----------------------------------|
| Shape         | Mirrors DB schema (camelCase)       | Business-relevant fields only     |
| Timestamps    | `createdAt`, `updatedAt`            | None                              |
| Input types   | None                                | `Create[Entity]Data`, `Update...` |
| Used by       | Repository, Mapper                  | Service, App components           |

```typescript
// data/model/[entity]Model.ts

export interface [Entity] {
  id: number;
  name: string;
  description: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Mappers

Centralize model <-> entity conversions. Imports from both `data/model` and `domain/entity/`.
This is the only place where both layers are known - never in line the mapper in the entity file
(domain must have zero imports).

```typescript
// data/mappers/[entity]Mapper.ts

export function to[Entity]Entity(model: [Entity]): [Entity]Entity { ... }
export function to[Entity]Entities(models: [Entity][]): [Entity}Entity[] {
```

### Repositories

SQL queries + snake_case-to-camelCase row mapping.

```typescript
// data/repository/[entity]Repository.ts

export class [Entity]Repository {
  private db = getDb();

  findAll(): [Entity]Entity[] { ... }
  findById(id: number): [Entity]Entity | undefined { ... }
  create(data: Create[Entity]Data): [Entity]Entity { ... }
  update(id: number, data: Update[Entity]Data): [Entity]Entity | undefined { ... }
  delete(id: number): boolean { ... }
}
```

### DB Infrastructure

- `client.ts` -- Singleton `getDb()`, auto-migrates on first call, WAL mode, FK enabled
- `config.ts` -- DB path from env vars (`DATABASE_DIR`, `DATABASE_FILE`)
- `migration/` -- `NNN_description.sql` files, tracked in `_migrations` table, atomic
- `script/` -- DB infrastructure only: `npm run db:migrate`, `npm run db:seed`, `npm run db:reset`
  CLI entity scripts live in `src/scripts/` (see scripts/ section)

---

## Application Layer (`src/app/`)

The only layer that knows Next.js and React.

### Component Organization

```
component/
├── layout/      Navbar, Footer, Header            (persistent, in layout.tsx)
├── section/     [Name]Section.tsx + child atoms    (composable page blocks)
├── ui/          Button, Card, Modal, Input         (reusable, no business logic)
└── form/        [Entity]Form.tsx                   (ui/ + validators + submit)
```

**`page.tsx` is composition only** -- import sections, render them in order, nothing else.

### Server vs Client Components

- **Server (default)**: call domain services, async data access, no hooks/events
- **Client (`"use client"`)**: interactivity, browser APIs, hooks, event handlers
- Data flows down: Server fetches, passes props to Client children

### API Routes

Boundary where validators run before calling services:

```typescript
// app/api/[entity]/route.ts
const parsed = create[Entity]Schema.parse(await req.json());  // validator
const result = create[Entity](parsed);                         // service
return Response.json(result, { status: 201 });
```

### i18n — Two-layer Approach

**UI texts** (labels, titles, buttons) → JSON files in `app/i18n/locales/`
**DB data** (artist bio, shop description…) → `*_translations` tables

#### `src/config/locale.ts` — single source of truth

```typescript
export type Locale = 'fr' | 'en';
export const locales: Locale[] = ['fr', 'en'];
export const defaultLocale: Locale = 'fr';
export type LocalizedText = Record<Locale, string>;
```

Importable by **all layers**. `app/i18n/config.ts` only holds UI data (display names, flags).

#### Translation tables pattern

Each entity with translated fields has a main table + a `*_translations` table:

```sql
-- Main table: locale-invariant data only
CREATE TABLE artists (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  username        TEXT UNIQUE NOT NULL,
  profile_pic_url TEXT NULL
);

-- Translations table: one row per (entity × locale)
CREATE TABLE artist_translations (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  artist_id INTEGER NOT NULL,
  locale    TEXT    NOT NULL,
  bio       TEXT    NOT NULL DEFAULT '',
  FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE,
  UNIQUE(artist_id, locale)
);
```

SQL rules:
- **No** `CHECK(locale IN ('fr','en'))` — validation in Zod, not SQL (adding a locale = zero migration)
- `ON DELETE CASCADE` — deleting the entity automatically deletes its translations
- `UNIQUE(entity_id, locale)` — enables the `ON CONFLICT DO UPDATE` pattern (upsert)

#### Repository pattern — reading with `json_group_object`

```typescript
// Single query, all translations aggregated as JSON by SQLite
const SELECT_WITH_TRANSLATIONS = `
  SELECT
    a.*,
    json_group_object(at.locale, at.bio) AS bio_json
  FROM artists a
  LEFT JOIN artist_translations at ON a.id = at.artist_id
  GROUP BY a.id
`;
```

The model exposes a `[Entity]Row` extending the base model:

```typescript
export interface ArtistRow extends Artist {
  bio_json: string | null; // null if no translations in DB
}
```

#### Mapper pattern — parsing + fallback

```typescript
// data/mappers/utils.ts — helper shared across all mappers
import { locales, defaultLocale } from '@/config/locales';
import type { LocalizedText } from '@/config/locales';

export function parseLocalizedText(json: string | null): LocalizedText {
  const raw: Partial<Record<string, string>> = json ? JSON.parse(json) : {};
  const fallback = raw[defaultLocale] ?? '';
  const result: Partial<LocalizedText> = {};
  for (const locale of locales) {
    result[locale] = raw[locale] ?? fallback;
  }
  return result as LocalizedText;
}
```

#### Repository pattern — writing in a transaction

```typescript
// create() : INSERT entity + INSERT translations (one per locale) in a transaction
// update() : UPDATE entity + UPSERT translations (ON CONFLICT DO UPDATE SET ...)
// delete() : unchanged, CASCADE handles translations automatically
```

#### Locale selection in components

The locale comes from the URL (`/fr`, `/en`), passed to `I18nProvider` via `[locale]/layout.tsx`,
and accessible in all child components via `useI18n()` — no `localStorage` access.

```tsx
// ✅ Dans n'importe quel Client Component
const { locale } = useI18n();
<p>{artist.bio[locale]}</p>

// ✅ In a Server Component (receives locale from params)
const { locale } = await params;
<p>{artist.bio[locale]}</p>

// ❌ Anti-pattern: never filter locale in the repository or service
findAll(locale: string) // FORBIDDEN — locale selection belongs to the UI layer
```

#### Adding a new locale

1. `src/config/locale.ts` → add the locale to the type and `locales[]` array
2. `src/app/i18n/config.ts` → add display name and flag
3. `src/app/i18n/locale/` → create the UI translations JSON file (`es.json`, etc.)
4. Populate DB translations via CLI scripts (`npm run artists:update`, etc.)
5. `generateStaticParams` in `[locale]/layout.tsx` and `[locale]/page.tsx` automatically generates
   the new route — **no other routing changes needed**
6. **No SQL migration needed**

### SEO

- **Root `layout.tsx`**: JSON-LD structured data (TattooParlor, LocalBusiness…), fonts, global scripts
- **`[locale]/layout.tsx`**: Locale Metadata API (title, description, hreflang, canonical) via `generateMetadata`
- `alternates.languages` in `generateMetadata` automatically generates correct hreflang tags
- Site constants in `config/site.ts`. Security headers + image optimization in `next.config.ts`

---

## Path Aliases (`tsconfig.json`)

| Alias            | Target             |
|------------------|--------------------|
| `@/*`            | `./src/*`          |
| `@/app/*`        | `./src/app/*`      |
| `@/domain/*`     | `./src/domain/*`   |
| `@/data/*`       | `./src/data/*`     |
| `@/validator/*`  | `./src/validator/*`|
| `@/config/*`     | `./src/config/*`   |

---

## Naming Conventions

### Files

| Layer     | Pattern                  | Example                 |
|-----------|--------------------------|-------------------------|
| Entity    | `[name]Entity.ts`        | `artistEntity.ts`       |
| Service   | `[name]Service.ts`       | `artistService.ts`      |
| Model     | `[name]Model.ts`         | `artistModel.ts`        |
| Mapper    | `[name]Mapper.ts`        | `artistMapper.ts`       |
| Repo      | `[name]Repository.ts`    | `artistRepository.ts`   |
| Adapter   | `[name]Adapter.ts`       | `emailAdapter.ts`       |
| Validator | `[name]Validator.ts`     | `artistValidator.ts`    |
| Error     | `[name]Error.ts`         | `notFoundError.ts`      |
| Component | `PascalCase.tsx`         | `ArtistCard.tsx`        |
| Section   | `[Name]Section.tsx`      | `HeroSection.tsx`       |
| Hook      | `use[Name].ts`           | `useTheme.ts`           |
| Provider  | `[Name]Provider.tsx`     | `ThemeProvider.tsx`      |
| Migration | `NNN_[desc].sql`         | `001_create_artists.sql` |

### Interfaces & Types

| Kind          | Pattern              | Example               |
|---------------|----------------------|-----------------------|
| Entity        | `[Name]Entity`       | `ArtistEntity`        |
| Model         | `[Name]`             | `Artist`              |
| Create input  | `Create[Name]Data`   | `CreateArtistDAta`    |
| Update input  | `Update[Name]Data`   | `UpdateArtistData`    |
| Error         | `[Name]Error`        | `NotFoundError`       |

---

## Adding a New Entity

### Without translations

| #  | Layer     | File to create                                                             |
|----|-----------|----------------------------------------------------------------------------|
| 1  | Data      | `data/db/migration/NNN_create_[entity].sql`                                |
| 2  | Data      | `data/model/[entity].ts` — interface mirroring the DB table                |
| 3  | Domain    | `domain/entity/[entity]Entity.ts` — Entity + Create/UpdateData + functions |
| 4  | Data      | `data/mapper/[entity]Mapper.ts`                                            |
| 5  | Data      | `data/repository/[entity]Repository.ts`                                    |
| 6  | Domain    | `domain/service/[entity]Service.ts`                                        |
| 7  | Validator | `validator/[entity]Validator.ts`                                           |
| 8  | App       | `app/api/[entity]/route.ts`                                                |
| 9  | App       | Components (section, card, form) as needed                                 |
| 10 | Scripts   | `script/[entity]/` CLI entry points (domain services + validators)         |

### With translations (`LocalizedText` fields)

Same checklist, with these additions:

| #  | Layer  | Difference                                                                                        |
|----|--------|---------------------------------------------------------------------------------------------------|
| 1  | Data   | Migration also includes `[entity]_translations` table with FK + UNIQUE(entity_id, locale)         |
| 2  | Data   | Add `[entity]Translation.ts` (mirror model) + `[Entity]Row extends [Entity]` with `*_json` fields |
| 3  | Domain | Translated fields typed `LocalizedText` in the entity, `Partial<LocalizedText>` in UpdateData     |
| 4  | Data   | Mapper uses `parseLocalizedText()` from `data/mapper/util.ts`                                     |
| 5  | Data   | Repository: SELECT with `json_group_object`, CREATE/UPDATE in transaction with upsert             |
| 7  | Valid. | `localizedTextSchema` for translated fields, `.partial()` for updates                             |
| 10 | Scripts| CLI displays `field.fr` / `field.en` separately, never `field` directly                           |

---

## Anti-Patterns

| Do NOT                         | Do instead                                         |
|--------------------------------|----------------------------------------------------|
| `app/lib/data/` or `app/type/` | `data/` layer for persistence, `domain/` for types |
| Import `data/` from components | Import `domain/service/` or `domain/entity/`       |
| Business logic in components   | Move to `domain/service/`                          |
| Validation inside services     | Use `validator/` at API/form boundary              |
| Direct DB calls in API routes  | API -> service -> repository                       |
| Catch-all `util.ts`             | Domain functions, hooks, or specific helpers      |
