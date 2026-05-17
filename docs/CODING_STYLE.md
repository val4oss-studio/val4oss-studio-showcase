# Code Conventions - Style Guide

> **For Claude Code:** These conventions are **NON-NEGOTIABLE**.
> All code suggestions MUST follow these rules.

## Table of Contents

1. [Naming Conventions](#naming-conventions)
2. [Formatting & Syntax](#formatting--syntax)
3. [TypeScript](#typescript)
4. [React & Next.js](#react--nextjs)
5. [File Structure](#file-structure)
6. [Imports](#imports)
7. [Comments](#comments)
8. [Tests](#tests)

---

## Naming Conventions

### Files and Folders

```
✅ GOOD
components/
  UserProfile.tsx          # React components → PascalCase
  fileName.tsx             # Regular files → camelCase

❌ BAD
components/
  userProfile.tsx          # No camelCase for components
  User_Profile.tsx         # No snake_case
```

### Variables and Functions

```typescript
// ✅ GOOD
const userName = 'John'                    // camelCase for variables
const MAX_RETRY_COUNT = 3                  // SCREAMING_SNAKE_CASE for constants
function calculateTotal() {}                // camelCase for functions
const getUserById = (id: string) => {}     // camelCase for arrow functions

// ❌ BAD
const UserName = 'John'                    // No PascalCase
const max_retry_count = 3                  // No snake_case
function CalculateTotal() {}                // No PascalCase
```

### React & Next.js

```typescript
// ✅ GOOD - Components
export function UserProfile() {}            // PascalCase
export const Button = () => {}              // PascalCase

// ✅ GOOD - Hooks
export function useAuth() {}                // "use" prefix + camelCase
export const useLocalStorage = () => {}    // "use" prefix + camelCase

// ✅ GOOD - Types & Interfaces
interface UserProps {}                      // PascalCase + "Props" suffix for props
type ApiResponse = {}                       // PascalCase
interface IUserRepository {}                // PascalCase + "I" prefix for interfaces (optional)

// ❌ BAD
function userProfile() {}                   // No camelCase for components
export function UseAuth() {}                // "Use" must be lowercase
interface userProps {}                      // No camelCase
```

### Classes and Objects (Domain Layer)

```typescript
// ✅ GOOD
class UserEntity {}                         // PascalCase
class CreateUserUseCase {}                  // PascalCase
class UserRepository {}                     // PascalCase

// Configuration objects
const dbConfig = {}                         // camelCase
const APP_CONFIG = {}                       // SCREAMING_SNAKE_CASE if immutable

// ❌ BAD
class userEntity {}                         // No camelCase
class create_user_usecase {}                // No snake_case
```

---

## Formatting & Syntax

### General Rules

```typescript
// ✅ Quotes: SINGLE quotes in TypeScript / JavaScript
const name = 'John'
import { Button } from './Button'

// ✅ Quotes: DOUBLE quotes in JSX attributes
<Button label="Submit" className="btn-primary" />

// ❌ BAD
const name = "John"                         // No double quotes in TS/JS
<Button label='Submit' />                   // No single quotes in JSX attrs

// ✅ Semicolons: ALWAYS
const x = 5;
function test() { return true; }

// ❌ BAD
const x = 5                                 // Missing semicolon

// ✅ Indentation: 2 SPACES
function example() {
  if (true) {
    console.log('test');
  }
}

// ❌ BAD
function example() {
    if (true) {                             // 4 spaces
        console.log('test');
    }
}

// ✅ Trailing commas: YES (except function parameters)
const obj = {
  name: 'test',
  age: 30,
};

const arr = [
  'one',
  'two',
];

// ❌ BAD - Trailing comma in function parameters
function test(
  param1: string,
  param2: number,  // ← Avoid
) {}
```

### Line Length

* Maximum 80 characters per line (including imports and comments)

### Braces and Spacing

```typescript
// ✅ GOOD - Braces on same line (K&R style)
if (condition) {
  doSomething();
} else {
  doSomethingElse();
}

// Spaces around operators
const sum = a + b;
const isValid = x === y;

// No space before function parentheses
function test() {}
const arrow = () => {};

// ❌ BAD
if (condition) 
{                                           // Brace on new line
  doSomething();
}

const sum=a+b;                              // Missing spaces
function test () {}                         // Space before parenthesis
```

---

## TypeScript

### Explicit Types

```typescript
// ✅ GOOD - Explicit types everywhere
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

const userName: string = 'John';
const userAge: number = 30;
const isActive: boolean = true;

// React props explicitly typed
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export function Button({ label, onClick, disabled }: ButtonProps) {
  // ...
}

// ❌ BAD - Type inference (except obvious cases)
function calculateTotal(items) {            // Missing types
  return items.reduce((sum, item) => sum + item.price, 0);
}

const userName = 'John';                    // OK for simple cases, but explicit preferred
```

### Any and Unknown

```typescript
// ✅ GOOD - Avoid 'any', prefer 'unknown'
function parseJson(json: string): unknown {
  return JSON.parse(json);
}

// If truly necessary, document why
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function legacyFunction(data: any): void {  // TODO: Type properly
  // ...
}

// ❌ BAD
function parseJson(json: string): any {     // Do not use 'any'
  return JSON.parse(json);
}
```

### Types vs Interfaces

```typescript
// ✅ Types for: unions, intersections, primitives
type Status = 'pending' | 'active' | 'completed';
type UserWithRole = User & { role: Role };
type Callback = (value: string) => void;

// ✅ Interfaces for: objects, contracts, classes
interface User {
  id: string;
  name: string;
  email: string;
}

interface IUserRepository {
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<void>;
}

// Preference: Interfaces for React props
interface ButtonProps {
  label: string;
  onClick: () => void;
}
```

### Enums

```typescript
// ✅ GOOD - Const enums or union types
export const UserRole = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest',
} as const;

type UserRoleType = typeof UserRole[keyof typeof UserRole];

// OR simple union type
type UserRole = 'admin' | 'user' | 'guest';

// ❌ AVOID - Classic enums (bundle size issues)
enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}
```

---

## React & Next.js

### JSX Quotes

```typescript
// ✅ GOOD — double quotes for JSX attributes (HTML convention)
export function Card() {
  return (
    <div className="card" aria-hidden="true">
      <button type="button" data-testid="card-btn">
        Click
      </button>
    </div>
  );
}

// ✅ GOOD — JS expressions inside JSX use single quotes as usual
const cls = 'card';
<div className={cls} />

// ❌ BAD
<div className='card' />          // No single quotes in JSX attributes
<button type='button' />          // No single quotes in JSX attributes
```

### Functional Components

```typescript
// ✅ GOOD - Named function with explicit types
interface UserCardProps {
  name: string;
  email: string;
  onEdit?: () => void;
}

export function UserCard({ name, email, onEdit }: UserCardProps) {
  return (
    <div>
      <h3>{name}</h3>
      <p>{email}</p>
      {onEdit && <button onClick={onEdit}>Edit</button>}
    </div>
  );
}

// ✅ GOOD - Arrow function also acceptable
export const UserCard = ({ name, email, onEdit }: UserCardProps) => {
  return (
    <div>
      {/* ... */}
    </div>
  );
};

// ❌ BAD
export default function({ name, email }) {  // No name, no types
  return <div>{name}</div>;
}

const UserCard = (props) => {               // No destructuring
  return <div>{props.name}</div>;
}
```

### Props and Destructuring

```typescript
// ✅ GOOD - Destructuring in parameters
export function Button({ label, onClick, disabled = false }: ButtonProps) {
  return <button onClick={onClick} disabled={disabled}>{label}</button>;
}

// ✅ GOOD - Complex props
interface FormProps {
  initialValues: FormData;
  onSubmit: (data: FormData) => void;
  children: React.ReactNode;
}

export function Form({ initialValues, onSubmit, children }: FormProps) {
  // ...
}

// ❌ BAD
export function Button(props: ButtonProps) {  // No destructuring
  return <button onClick={props.onClick}>{props.label}</button>;
}
```

### Hooks

```typescript
// ✅ GOOD - Hooks at top of component, consistent order
export function UserProfile() {
  // 1. State hooks
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  
  // 2. Effect hooks
  useEffect(() => {
    loadUser();
  }, []);
  
  // 3. Custom hooks
  const { isAuthenticated } = useAuth();
  
  // 4. Callbacks and memoization
  const handleSave = useCallback(() => {
    // ...
  }, [user]);
  
  // 5. Early returns
  if (loading) return <Spinner />;
  if (!user) return <NotFound />;
  
  // 6. Render
  return <div>{user.name}</div>;
}

// ❌ BAD - Conditional hooks
export function UserProfile() {
  if (condition) {
    const [state, setState] = useState();  // ❌ Conditional hook
  }
}
```

### Server vs Client Components

```typescript
// ✅ Server Component (default - no directive)
// src/ui/app/page.tsx
export default async function HomePage() {
  const data = await fetchData();
  
  return (
    <div>
      <h1>Home</h1>
      <ClientButton />
    </div>
  );
}

// ✅ Client Component ('use client' directive on FIRST line)
// src/ui/components/ClientButton.tsx
'use client';

import { useState } from 'react';

export function ClientButton() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}

// ❌ BAD
'use client'                                // Missing semicolon

import { useState } from 'react'            // 'use client' must be first
'use client';
```

---

## File Structure

### Component Organization

```typescript
// ✅ GOOD - Standard component file structure
// src/ui/components/UserCard.tsx

// 1. Directives (if needed)
'use client';

// 2. External imports
import { useState } from 'react';
import Link from 'next/link';

// 3. Internal imports (absolute with alias)
import { formatDate } from '@/utils/date';
import { Button } from '@/ui/components/Button';

// 4. Types and interfaces
interface UserCardProps {
  user: User;
  onEdit: () => void;
}

// 5. Local constants
const DEFAULT_AVATAR = '/images/default-avatar.png';

// 6. Main component
export function UserCard({ user, onEdit }: UserCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div>
      {/* ... */}
    </div>
  );
}

// 7. Helper components (if small and related)
function UserAvatar({ src }: { src: string }) {
  return <img src={src || DEFAULT_AVATAR} alt="" />;
}

// 8. Additional named exports (if needed)
export type { UserCardProps };
```

### One Component = One File

```
✅ GOOD
components/
  UserCard.tsx
  UserCard.test.tsx
  UserCard.module.css      (if CSS modules)

✅ GOOD - Complex component with sub-components
components/
  UserCard/
    UserCard.tsx           (main exported component)
    UserAvatar.tsx         (sub-component if reused)
    UserBadge.tsx
    types.ts               (shared types)
    index.ts               (clean re-export)

❌ BAD
components/
  UserComponents.tsx       (multiple components in one file)
```

---

## Imports

### Import Order

```typescript
// ✅ GOOD - Standardized order
// 1. React and Next.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// 2. External libraries (alphabetical order)
import { z } from 'zod';
import clsx from 'clsx';

// 3. Internal imports - @ alias (layers top to bottom)
import { createUser } from '@/domain/usecases/createUser';
import { UserRepository } from '@/data/repositories/UserRepository';
import { Button } from '@/ui/components/Button';
import { formatDate } from '@/utils/date';

// 4. Relative imports (avoid if possible)
import { helper } from './helpers';

// 5. Styles (always last)
import styles from './UserCard.module.css';

// ❌ BAD - Random mix
import { Button } from '@/ui/components/Button';
import { useState } from 'react';
import styles from './UserCard.module.css';
import Link from 'next/link';
```

### Import / Export

```typescript
// ✅ GOOD - Named exports (preferred)
export function Button() {}
export const config = {};
export type ButtonProps = {};

// Import
import { Button, config, type ButtonProps } from './Button';

// ✅ GOOD - Default export for Next.js pages only
// app/page.tsx
export default function HomePage() {}

// ❌ AVOID - Default exports for components
export default function Button() {}         // Prefer named export
```

---

## Comments

### When to Comment

```typescript
// ✅ GOOD - Comment the "why", not the "what"

// Workaround: Safari does not support scrollIntoView with smooth behavior
element.scrollIntoView({ behavior: 'auto' });

// HACK: Temporary fix for race condition in user loading
// TODO: Refactor with proper loading state management
await sleep(100);

/**
 * Calculates total price with discount and taxes.
 * 
 * @param items - List of items
 * @param discountCode - Optional promo code
 * @returns Total price including tax in euros
 */
export function calculateTotal(
  items: Item[], 
  discountCode?: string
): number {
  // ...
}

// ❌ BAD - Useless comments
// Create a variable for the name
const name = 'John';                        // Obvious

// Loop over items
items.forEach(item => {                     // Obvious
  // ...
});
```

### Comment Types

```typescript
// TODO: Implement email validation
// FIXME: Bug with special characters
// HACK: Temporary solution, to be refactored
// NOTE: This function is called by the external webhook
// @deprecated Use newFunction() instead
```

### JSDoc for Complex Types

```typescript
// ✅ GOOD - JSDoc for complex public functions
/**
 * Creates a new user in the system.
 * 
 * @param userData - User data
 * @param options - Creation options
 * @param options.sendEmail - Send welcome email (default: true)
 * @param options.role - Role to assign (default: 'user')
 * @returns The created user with their ID
 * @throws {ValidationError} If data is invalid
 * @throws {DuplicateError} If email already exists
 * 
 * @example
 * ```ts
 * const user = await createUser({
 *   name: 'John',
 *   email: 'john@example.com'
 * });
 * ```
 */
export async function createUser(
  userData: UserData,
  options?: CreateUserOptions
): Promise<User> {
  // ...
}
```

---

## Tests

### Test Naming

```typescript
// ✅ GOOD - describe / it pattern
describe('UserCard', () => {
  it('should render user name', () => {
    // ...
  });
  
  it('should call onEdit when edit button is clicked', () => {
    // ...
  });
  
  it('should show loading state when data is fetching', () => {
    // ...
  });
});

// ✅ GOOD - test() also acceptable
test('UserCard renders user name', () => {
  // ...
});

// ❌ BAD
describe('UserCard', () => {
  it('renders', () => {                     // Too vague
    // ...
  });
  
  it('test edit button', () => {            // Not descriptive enough
    // ...
  });
});
```

### Test Structure

```typescript
// ✅ GOOD - Arrange-Act-Assert (AAA) pattern
it('should calculate total with discount', () => {
  // Arrange - Prepare data
  const items = [
    { price: 10, quantity: 2 },
    { price: 20, quantity: 1 },
  ];
  const discountCode = 'SAVE10';
  
  // Act - Execute the action
  const total = calculateTotal(items, discountCode);
  
  // Assert - Verify the result
  expect(total).toBe(36); // (10*2 + 20) - 10% = 36
});
```

---

## Pre-Commit Checklist

- [ ] Naming conventions respected (files, variables, functions)
- [ ] Single quotes and semicolons everywhere
- [ ] Explicit TypeScript types (no any)
- [ ] Imports ordered correctly
- [ ] No forgotten console.log
- [ ] Relevant comments (why, not what)
- [ ] Tests pass (if applicable)
- [ ] No dead code (commented code, unused imports)
- [ ] Line length < 100 characters

---

**Note for Claude Code:** When in doubt about a convention, consult this file FIRST before proposing code.
