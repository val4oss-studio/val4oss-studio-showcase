# Database - SQLite3

## Installation and Setup

### Installation

```bash
# better-sqlite3 (recommended for Node.js)
npm install better-sqlite3
npm install -D @types/better-sqlite3
```

### SQLite Client

```typescript
// ✅ src/data/db/client.ts
import Database from 'better-sqlite3';

// Singleton instance
let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    // Create/open the database
    db = new Database('local.db', {
      // verbose: console.log, // Uncomment to debug SQL
    });
    
    // Optimal configuration (see next section)
    db.pragma('journal_mode = WAL');
    db.pragma('synchronous = NORMAL');
    db.pragma('foreign_keys = ON');
    db.pragma('temp_store = MEMORY');
  }
  
  return db;
}

// Export for direct use
export const db = getDb();

// Clean close (important for cleanup)
export function closeDb(): void {
  if (db) {
    db.close();
    db = null;
  }
}

// Cleanup hook for Next.js
if (typeof process !== 'undefined') {
  process.on('exit', closeDb);
  process.on('SIGINT', () => process.exit(0));
  process.on('SIGTERM', () => process.exit(0));
}
```

### Recommended File Structure

```
src/data/db/
├── client.ts           # SQLite client (above)
├── schema.sql          # Initial schema
├── migrations/         # SQL migrations
│   ├── 001_init.sql
│   ├── 002_addUsers.sql
│   └── 003_addProducts.sql
├── migrate.ts          # Migration runner script
└── seed.ts            # Initial data (optional)
```

---

## Optimal Configuration

### Essential PRAGMAs

SQLite PRAGMAs are configuration commands that optimize database performance and behavior.

```typescript
// ✅ Optimal configuration in client.ts
import Database from 'better-sqlite3';

export function getDb(): Database.Database {
  if (!db) {
    db = new Database('local.db');
    
    // 1. WAL Mode (Write-Ahead Logging)
    // Improves read/write concurrency
    // Better overall performance
    db.pragma('journal_mode = WAL');
    
    // 2. Synchronous Normal
    // Balance between safety and performance
    // FULL = safer but slow, OFF = fast but risky
    db.pragma('synchronous = NORMAL');
    
    // 3. Foreign Keys ON
    // Enables foreign key constraints
    // IMPORTANT: disabled by default in SQLite
    db.pragma('foreign_keys = ON');
    
    // 4. Temp Store in memory
    // Temporary tables in RAM (faster)
    db.pragma('temp_store = MEMORY');
    
    // 5. Cache Size (optional)
    // Cache of 10000 pages (~40MB with 4KB pages)
    db.pragma('cache_size = 10000');
    
    // 6. Memory-mapped I/O (optional, for large DBs)
    // 30GB max in mmap (improves reads)
    db.pragma('mmap_size = 30000000000');
  }
  
  return db;
}
```

---

## Database Schema


### SQLite Data Types

SQLite uses a dynamic typing system with 5 storage classes:

| Type SQL | Storage Class | TypeScript | Exemple |
|----------|---------------|------------|---------|
| `TEXT` | TEXT | `string` | 'John Doe' |
| `INTEGER` | INTEGER | `number` | 42 |
| `REAL` | REAL | `number` | 3.14 |
| `BLOB` | BLOB | `Buffer` | Binary data |
| `NULL` | NULL | `null` | null |

**Important:** SQLite stores dates as INTEGER (timestamp) or TEXT (ISO 8601).

### Full SQL Schema

```sql
-- ✅ src/data/db/schema.sql

-- Table Users
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' 
    CHECK(role IN ('admin', 'user', 'guest')),
  is_active INTEGER NOT NULL DEFAULT 1 
    CHECK(is_active IN (0, 1)),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- Index on email (frequent searches)
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Table Products
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL CHECK(price >= 0), -- Price in cents
  stock INTEGER NOT NULL DEFAULT 0 CHECK(stock >= 0),
  image_url TEXT,
  category_id TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (category_id) 
    REFERENCES categories(id) 
    ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_products_category 
  ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);

-- Table Categories
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- Table Orders
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' 
    CHECK(status IN (
      'pending', 
      'processing', 
      'shipped', 
      'delivered', 
      'cancelled'
    )),
  total_amount INTEGER NOT NULL CHECK(total_amount >= 0),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) 
    REFERENCES users(id) 
    ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at);

-- Table Order Items (many-to-many)
CREATE TABLE IF NOT EXISTS order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK(quantity > 0),
  price_at_purchase INTEGER NOT NULL CHECK(price_at_purchase >= 0),
  FOREIGN KEY (order_id) 
    REFERENCES orders(id) 
    ON DELETE CASCADE,
  FOREIGN KEY (product_id) 
    REFERENCES products(id) 
    ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_order_items_order 
  ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product 
  ON order_items(product_id);
```

### Important Conventions

**1. Primary Keys**
- Use `TEXT` with UUID/ULID rather than `INTEGER AUTOINCREMENT`
- More flexible, avoids collisions when merging DBs

**2. Booleans**
- SQLite has no native BOOLEAN type
- Use `INTEGER` with CHECK(0 or 1)
- `0 = false`, `1 = true`

**3. Dates/Timestamps**
- Use `INTEGER` to store Unix timestamp (milliseconds)
- Easy to manipulate in JavaScript: `Date.now()`

**4. Prices/Amounts**
- Always `INTEGER` (cents, not euros/dollars)
- Avoids precision issues with REAL

**5. Enums**
- Use `TEXT` with `CHECK(column IN (...))`
- Type-safe at DB level

---

## Migrations

### Migration Structure

```sql
-- ✅ src/data/db/migrations/001_init.sql

-- Up Migration
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  created_at INTEGER NOT NULL
);

CREATE INDEX idx_users_email ON users(email);

-- Down Migration (in comment or separate file)
-- DROP INDEX idx_users_email;
-- DROP TABLE users;
```

### Migration Runner Script

```typescript
// ✅ src/data/db/migrate.ts
import { db } from './client';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

// Migration tracking table
function createMigrationsTable() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL UNIQUE,
      executed_at INTEGER NOT NULL
    )
  `);
}

// Run migrations
export function runMigrations() {
  createMigrationsTable();
  
  const migrationsDir = join(__dirname, 'migrations');
  const files = readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();
  
  const executed = db
    .prepare('SELECT filename FROM migrations')
    .all() as { filename: string }[];
  
  const executedSet = new Set(executed.map(m => m.filename));
  
  for (const file of files) {
    if (executedSet.has(file)) {
      console.log(`✓ Migration ${file} already executed`);
      continue;
    }
    
    console.log(`→ Running migration ${file}...`);
    
    const sql = readFileSync(join(migrationsDir, file), 'utf-8');
    
    db.transaction(() => {
      db.exec(sql);
      db.prepare(
        'INSERT INTO migrations (filename, executed_at) VALUES (?, ?)'
      ).run(file, Date.now());
    })();
    
    console.log(`✓ Migration ${file} completed`);
  }
  
  console.log('All migrations completed!');
}

// Run if called directly
if (require.main === module) {
  runMigrations();
  process.exit(0);
}
```

### Usage

```bash
# Run migrations
node -r tsx src/data/db/migrate.ts

# Or add script to package.json
"scripts": {
  "db:migrate": "tsx src/data/db/migrate.ts"
}
```

---

## i18n — Translation Tables

### Principle: Separate Tables per Entity

For multilingual fields, do **not** add one column per locale (`name_fr`, `name_en`). Use a separate translations table, which allows adding a new locale without modifying the SQL schema.

```
✅ Recommended pattern:
  [entity]                        [entity]_translations
  ────────────────                ──────────────────────────────────────
  id TEXT PRIMARY KEY      ←─     entity_id TEXT NOT NULL (FK ON DELETE CASCADE)
  ... locale-invariant fields ... locale TEXT NOT NULL
                                  ... translatable fields ...
                                  UNIQUE(entity_id, locale)
```

### SQL Schema

```sql
-- Main table: fields identical in all languages
CREATE TABLE IF NOT EXISTS artists (
  id          TEXT    NOT NULL PRIMARY KEY,
  username    TEXT    NOT NULL UNIQUE,
  ig_id       TEXT    NOT NULL UNIQUE,
  profile_pic_url TEXT,
  created_at  INTEGER NOT NULL,
  updated_at  INTEGER NOT NULL
);

-- Translations table: localized fields
CREATE TABLE IF NOT EXISTS artist_translations (
  id        TEXT    NOT NULL PRIMARY KEY,
  artist_id TEXT    NOT NULL,
  locale    TEXT    NOT NULL,
  bio       TEXT    NOT NULL,
  FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE,
  UNIQUE(artist_id, locale)
);

CREATE INDEX IF NOT EXISTS idx_artist_translations_artist_id
  ON artist_translations(artist_id);
```

**Why no `CHECK(locale IN ('fr', 'en'))`?**
SQLite does not support `ALTER TABLE` to modify a CHECK constraint — the entire table would need to be recreated. By validating the locale only through Zod, adding a new locale requires **no SQL migration**.

### Reading: `json_group_object`

Use the SQLite aggregate `json_group_object` to retrieve all translations in **a single JOIN query**, with no N+1 queries.

```typescript
// ✅ src/data/repositories/artistRepository.ts
const SELECT_WITH_TRANSLATIONS = `
  SELECT
    a.*,
    json_group_object(at.locale, at.bio) AS bio_json
  FROM artists a
  LEFT JOIN artist_translations at ON a.id = at.artist_id
  GROUP BY a.id
`;

// bio_json result: '{"fr":"Mon texte","en":"My text"}'
```

The `ArtistRow` model extends `Artist` with `*_json` fields:

```typescript
// ✅ src/data/models/artist.ts
export interface Artist {
  id: string;
  username: string;
  ig_id: string;
  profile_pic_url: string | null;
  created_at: number;
  updated_at: number;
}

// Raw JOIN query result — bio_json is null if no translations exist
export interface ArtistRow extends Artist {
  bio_json: string | null;
}
```

### Helper: `parseLocalizedText`

```typescript
// ✅ src/data/mappers/utils.ts
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

- If `json` is `null` (no translations) → returns `{ fr: '', en: '' }`
- If a locale is missing → fallback to `defaultLocale`
- Robust to adding a new locale without modification

### Writing: Transaction INSERT + INSERT translations

```typescript
// ✅ src/data/repositories/artistRepository.ts
export function create(data: CreateArtistData): ArtistEntity {
  const id = crypto.randomUUID();
  const now = Date.now();

  const insertArtist = db.prepare(`
    INSERT INTO artists (id, username, ig_id, profile_pic_url, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const insertTranslation = db.prepare(`
    INSERT INTO artist_translations (id, artist_id, locale, bio)
    VALUES (?, ?, ?, ?)
  `);

  db.transaction(() => {
    insertArtist.run(id, data.username, data.instagramId, data.profilePicture ?? null, now, now);

    for (const locale of locales) {
      insertTranslation.run(crypto.randomUUID(), id, locale, data.bio[locale]);
    }
  })();

  return findById(id)!;
}
```

### Update: UPSERT with `ON CONFLICT DO UPDATE`

To update a single locale without overwriting others:

```typescript
// ✅ UPSERT — insert if absent, update if existing
const upsertTranslation = db.prepare(`
  INSERT INTO artist_translations (id, artist_id, locale, bio)
  VALUES (?, ?, ?, ?)
  ON CONFLICT(artist_id, locale) DO UPDATE SET
    bio = excluded.bio
`);

// Update only the provided locales
if (data.bio) {
  for (const [locale, value] of Object.entries(data.bio)) {
    upsertTranslation.run(crypto.randomUUID(), id, locale, value);
  }
}
```

The `UpdateArtistData` type uses `Partial<LocalizedText>` to allow updating a single locale:

```typescript
// ✅ src/domain/entities/artistEntity.ts
export interface UpdateArtistData {
  username?: string;
  bio?: Partial<LocalizedText>; // { fr: '...' } sans toucher 'en'
  instagramId?: string;
  profilePicture?: string;
}
```

### Locale Selection in Components

**Critical rule:** Never select the locale in the `data` or `domain` layer. Entities always return the full `LocalizedText`.

```typescript
// ❌ BAD — selection in the repository
const bio = artist.bio[defaultLocale]; // No!

// ✅ GOOD — selection in the Client Component
'use client';
import { useI18n } from '@/app/i18n/provider';

export function ArtistCard({ artist }: { artist: ArtistEntity }) {
  const { locale } = useI18n();
  return <p>{artist.bio[locale]}</p>;
}
```

### Adding a New Locale

1. **`src/config/locales.ts`** — add the locale to the type and array:
   ```typescript
   export type Locale = 'fr' | 'en' | 'de';
   export const locales: Locale[] = ['fr', 'en', 'de'];
   ```
2. **`src/app/i18n/config.ts`** — add the name and flag
3. **`src/data/db/scripts/seed.ts`** — add values for the new locale
4. **No SQL migration needed** — the `*_translations` table accepts any locale value
5. Run `npm run db:migrate && npm run db:seed` to repopulate

### npm Scripts

```bash
# Reset and migrate the database
npm run db:migrate

# Populate with initial data
npm run db:seed

# View the element
npm run element:get

# Update a value of an element
npm run element:update name "New value"

# Update a translated shop field (e.g.: description, locale fr)
npm run element:update description fr "A A tattoo studio..."

# List elements
npm run elements:list

# Add an element
npm run elements:add <username> <instagramId> <bio_fr> <bio_en> [profilePicture]
```

---

## SQL Queries

### Prepared Statements (Recommended)

```typescript
// ✅ ALWAYS use prepared statements
import { db } from '@/data/db/client';

// SELECT
interface User {
  id: string;
  name: string;
  email: string;
  created_at: number;
}

export function getUserById(id: string): User | undefined {
  const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
  return stmt.get(id) as User | undefined;
}

export function getAllUsers(): User[] {
  const stmt = db.prepare(
    'SELECT * FROM users ORDER BY created_at DESC'
  );
  return stmt.all() as User[];
}

export function getUsersByRole(role: string): User[] {
  const stmt = db.prepare('SELECT * FROM users WHERE role = ?');
  return stmt.all(role) as User[];
}

// INSERT
export function createUser(data: {
  name: string;
  email: string;
  passwordHash: string;
}): User {
  const id = crypto.randomUUID();
  const now = Date.now();
  
  const stmt = db.prepare(`
    INSERT INTO users (
      id, 
      name, 
      email, 
      password_hash, 
      created_at, 
      updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  
  stmt.run(
    id, 
    data.name, 
    data.email, 
    data.passwordHash, 
    now, 
    now
  );
  
  return getUserById(id)!;
}

// UPDATE
export function updateUser(id: string, data: {
  name?: string;
  email?: string;
}): User | undefined {
  const updates: string[] = [];
  const values: any[] = [];
  
  if (data.name !== undefined) {
    updates.push('name = ?');
    values.push(data.name);
  }
  
  if (data.email !== undefined) {
    updates.push('email = ?');
    values.push(data.email);
  }
  
  if (updates.length === 0) return getUserById(id);
  
  updates.push('updated_at = ?');
  values.push(Date.now());
  values.push(id);
  
  const stmt = db.prepare(`
    UPDATE users 
    SET ${updates.join(', ')}
    WHERE id = ?
  `);
  
  stmt.run(...values);
  
  return getUserById(id);
}

// DELETE
export function deleteUser(id: string): void {
  const stmt = db.prepare('DELETE FROM users WHERE id = ?');
  stmt.run(id);
}
```

### Complex Queries

```typescript
// ✅ JOIN with pagination
export function getOrdersWithItems(
  userId: string, 
  page = 1, 
  limit = 20
) {
  const offset = (page - 1) * limit;
  
  const stmt = db.prepare(`
    SELECT 
      o.id as order_id,
      o.status,
      o.total_amount,
      o.created_at,
      oi.quantity,
      oi.price_at_purchase,
      p.name as product_name
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON oi.product_id = p.id
    WHERE o.user_id = ?
    ORDER BY o.created_at DESC
    LIMIT ? OFFSET ?
  `);
  
  return stmt.all(userId, limit, offset);
}

// ✅ Aggregation

export function getOrderStats(userId: string) {
  const stmt = db.prepare(`
    SELECT 
      COUNT(*) as total_orders,
      SUM(total_amount) as total_spent,
      AVG(total_amount) as avg_order
    FROM orders
    WHERE user_id = ?
  `);
  
  return stmt.get(userId);
}

// ✅ Full-text search (simple)
export function searchProducts(query: string) {
  const stmt = db.prepare(`
    SELECT * FROM products
    WHERE name LIKE ? OR description LIKE ?
    LIMIT 20
  `);
  
  const pattern = `%${query}%`;
  return stmt.all(pattern, pattern);
}
```

### Named Parameters (Alternative)

```typescript
// ✅ Named parameters (more readable for complex queries)
export function createOrder(data: {
  userId: string;
  items: Array<{ productId: string; quantity: number }>;
}) {
  const orderId = crypto.randomUUID();
  const now = Date.now();
  
  // Calculate total
  const total = data.items.reduce((sum, item) => {
    const product = getProductById(item.productId);
    return sum + (product.price * item.quantity);
  }, 0);
  
  const stmt = db.prepare(`
    INSERT INTO orders (
      id, 
      user_id, 
      status, 
      total_amount, 
      created_at, 
      updated_at
    )
    VALUES (:id, :userId, :status, :total, :now, :now)
  `);
  
  stmt.run({
    id: orderId,
    userId: data.userId,
    status: 'pending',
    total,
    now,
  });
  
  return orderId;
}
```

---

## Transactions

### Simple Transaction

```typescript
// ✅ Transaction with automatic rollback on error
export function transferFunds(
  fromUserId: string, 
  toUserId: string, 
  amount: number
) {
  const transaction = db.transaction(() => {
    // Debit
    db.prepare('UPDATE users SET balance = balance - ? WHERE id = ?')
      .run(amount, fromUserId);
    
    // Credit
    db.prepare('UPDATE users SET balance = balance + ? WHERE id = ?')
      .run(amount, toUserId);
  });
  
  transaction(); // Execute the transaction
}
```

### Complex Transaction

```typescript
// ✅ Create an order with items (complete transaction)
export function createOrderWithItems(data: {
  userId: string;
  items: Array<{ productId: string; quantity: number }>;
}) {
  const createOrder = db.transaction(() => {
    const orderId = crypto.randomUUID();
    const now = Date.now();
    let totalAmount = 0;
    
    // 1. Create the order
    db.prepare(`
      INSERT INTO orders (
        id, 
        user_id, 
        status, 
        total_amount, 
        created_at, 
        updated_at
      )
      VALUES (?, ?, 'pending', 0, ?, ?)
    `).run(orderId, data.userId, now, now);
    
    // 2. For each item
    for (const item of data.items) {
      // Retrieve the product
      const product = db.prepare(
        'SELECT * FROM products WHERE id = ?'
      ).get(item.productId) as any;
      
      if (!product) {
        throw new Error(`Product ${item.productId} not found`);
      }
      
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }
      
      // Create order item
      db.prepare(`
        INSERT INTO order_items (
          id, 
          order_id, 
          product_id, 
          quantity, 
          price_at_purchase
        )
        VALUES (?, ?, ?, ?, ?)
      `).run(
        crypto.randomUUID(),
        orderId,
        product.id,
        item.quantity,
        product.price
      );
      
      // Decrement stock
      db.prepare(
        'UPDATE products SET stock = stock - ? WHERE id = ?'
      ).run(item.quantity, product.id);
      
      totalAmount += product.price * item.quantity;
    }
    
    // 3. Update total amount
    db.prepare('UPDATE orders SET total_amount = ? WHERE id = ?')
      .run(totalAmount, orderId);
    
    return orderId;
  });
  
  return createOrder(); // Execute and return orderId
}
```

### Error Handling

```typescript
// ✅ Try-catch with transaction
export function safeCreateOrder(data: any) {
  try {
    const orderId = createOrderWithItems(data);
    return { success: true, orderId };
  } catch (error) {
    // Transaction automatically rolled back
    console.error('Order creation failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}
```

---

## Indexing

### Index Types

```sql
-- ✅ Simple index (single column)
CREATE INDEX idx_users_email ON users(email);

-- ✅ Composite index (multiple columns)
CREATE INDEX idx_orders_user_status ON orders(user_id, status);

-- ✅ UNIQUE index
CREATE UNIQUE INDEX idx_users_email_unique ON users(email);

-- ✅ Conditional index (partial index)
CREATE INDEX idx_active_users ON users(email) WHERE is_active = 1;

-- ✅ Expression index
CREATE INDEX idx_users_email_lower ON users(LOWER(email));
```

### When to Create an Index

✅ **Create index if:**
- Column frequently used in WHERE clause
- Column in JOIN conditions
- Column in ORDER BY
- Foreign keys (improves JOIN performance)
- Unique columns (email, username)

❌ **Do NOT index if:**
- Very small table (<1000 rows)
- Column rarely used in queries
- Column with few distinct values (booleans)
- Too many indexes slow down INSERT/UPDATE

### Analyzing Performance

```typescript
// ✅ EXPLAIN QUERY PLAN
const plan = db.prepare(
  'EXPLAIN QUERY PLAN SELECT * FROM users WHERE email = ?'
).all('test@example.com');
console.log(plan);

// Look for "SCAN" (bad) vs "SEARCH" (good)
// SCAN TABLE = no index used
// SEARCH TABLE USING INDEX = index used ✓
```

---

## Best Practices

### 1. Always Use Transactions for Multiple Operations

```typescript
// ❌ BAD - Not atomic
function badTransfer(from: string, to: string, amount: number) {
  db.prepare('UPDATE users SET balance = balance - ? WHERE id = ?')
    .run(amount, from);
  db.prepare('UPDATE users SET balance = balance + ? WHERE id = ?')
    .run(amount, to);
  // Error between the two = corrupted data!
}

// ✅ GOOD - Atomic
function goodTransfer(from: string, to: string, amount: number) {
  const transfer = db.transaction(() => {
    db.prepare('UPDATE users SET balance = balance - ? WHERE id = ?')
      .run(amount, from);
    db.prepare('UPDATE users SET balance = balance + ? WHERE id = ?')
      .run(amount, to);
  });
  
  transfer();
}
```

### 2. Use Prepared Statements (Security + Performance)

```typescript
// ❌ BAD - SQL Injection possible
function badQuery(email: string) {
  return db.exec(`SELECT * FROM users WHERE email = '${email}'`);
  // email = "'; DROP TABLE users; --" = disaster
}

// ✅ GOOD - Secure
function goodQuery(email: string) {
  return db.prepare('SELECT * FROM users WHERE email = ?')
    .get(email);
}
```

### 3. Store Prices in Cents (Integer)

```typescript
// ✅ GOOD
const product = {
  price: 1999, // €19.99
};

// Display
const displayPrice = (price: number) => (price / 100).toFixed(2);

// ❌ BAD - Floats = precision issues
const product = {
  price: 19.99, // Precision problems
};
```

### 4. Timestamps as Integer (Unix Timestamp)

```typescript
// ✅ GOOD
const now = Date.now(); // 1705334400000
db.prepare('INSERT INTO users (created_at) VALUES (?)')
  .run(now);

// Read
const user = db.prepare('SELECT created_at FROM users WHERE id = ?')
  .get(id);
const date = new Date(user.created_at);

// ❌ BAD - TEXT is complicated to manipulate
db.prepare('INSERT INTO users (created_at) VALUES (?)')
  .run(new Date().toISOString());
```

### 5. Validate in `validator/` at boundaries (API routes, CLI scripts), not in services or repositories

```typescript
// ❌ BAD - Validation in repository
class UserRepository {
  createUser(data: any) {
    if (!data.email.includes('@')) {
      throw new Error('Invalid email');
    }
    // ...
  }
}

// ✅ GOOD - Validation in script or API
const parsed = create[Entity]Schema.safeParse({
  username,
  ig_id,
  description,
  profile_pic_url,
});

if (!parsed.success) {
  console.error('Validation error:');
  parsed.error.issues.forEach(issue => {
    console.error(`- ${issue.path.join('.')} : ${issue.message}`);
  });
  process.exit(1);
}
```

### 6. Create Indexes for Foreign Keys

```sql
-- ✅ GOOD - Index on foreign key
CREATE TABLE orders (
  user_id TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
-- Improves JOIN performance
```

### 7. Use CHECK Constraints

```sql
-- ✅ GOOD - Validation at DB level
CREATE TABLE products (
  price INTEGER NOT NULL CHECK(price >= 0),
  stock INTEGER NOT NULL CHECK(stock >= 0),
  status TEXT CHECK(status IN ('active', 'inactive', 'deleted'))
);
```

### 8. Regular Backups

```typescript
// ✅ Backup script
import { copyFileSync } from 'fs';

export function backupDatabase() {
  const timestamp = new Date()
    .toISOString()
    .replace(/:/g, '-');
  const backupPath = `./backups/db_${timestamp}.db`;
  
  // Close connections
  closeDb();
  
  // Copy the file
  copyFileSync('local.db', backupPath);
  
  console.log(`Backup created: ${backupPath}`);
  
  // Reopen
  getDb();
}
```

### 9. Do NOT Commit the DB to Git

```gitignore
# .gitignore
*.db
*.db-shm
*.db-wal
/backups/
```

### 10. Use WAL Mode in Production

```typescript
// ✅ ALWAYS enable WAL mode
db.pragma('journal_mode = WAL');

// Creates 3 files:
// - local.db (data)
// - local.db-wal (write-ahead log)
// - local.db-shm (shared memory)
```

---

**Note for Claude Code:** Always follow these patterns when suggesting database code. Use pure SQLite3 with better-sqlite3, no ORM.

**Critical rules reminder:**
1. ✅ **Transactions** for multiple operations
2. ✅ **Prepared statements** always
3. ✅ **Prices in cents** (INTEGER)
4. ✅ **Timestamps as INTEGER** (Unix ms)
5. ✅ **Foreign keys ON** (pragma)
6. ✅ **WAL mode** in production
7. ✅ **Indexes** on frequently queried columns
