<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## 🚀 Main Technical Stack

### Next.js 16+
- **App Router** required (no Pages Router)
- Default Server Components
- Client Components only for interactivity
- Server Actions for data mutations

### Architecture
- Strict **Clean Architecture**: data -> domain <- ui
- Clear separation of responsibilities
- See `docs/ARCHITECTURE.md` for the complete structure

### Database
- **SQLite3** for showcase sites and simple projects
- Versioned migrations (`NNN_description.sql`)
- See `docs/DATABASE.md` for complete configuration

### Internationalization (i18n)
- **UI texts**: JSON files in `app/i18n/locales/` via the `useI18n()` provider
- **DB data**: separate `*_translations` tables, pattern `LocalizedText = Record<Locale, string>`
- **Local source of truth**: `src/config/locales.ts` — importable by all layers
- **Locale selection**: component side only (`field[locale]`), never in the repository
- See `docs/ARCHITECTURE.md` section i18n for the complete pattern

### TypeScript
- Explicit types everywhere (no `any`)
- Interfaces for public contracts
- Types for internal structures
- See `docs/CODING_STYLE.md` for conventions

## Specific rules for agents

* Do not duplicate code. If a function or pattern already exists, reuse it instead of creating a new one.
* Reuse existing css classes and styles. If a design already exists, use it instead of creating a new one.
* Follow the existing file structure and naming conventions. If a file or component already exists, add to it instead of creating a new one.
