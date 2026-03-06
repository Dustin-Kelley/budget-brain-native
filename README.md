# Budget Brain

A household budgeting app built for young families. Multiple family members sign up under one household and collaborate on a shared budget — tracking income, planning spending by category, and logging transactions together in real time.

The "Brain" in Budget Brain? That's the vision. We're building toward AI-powered insights and actionable recommendations based on your household's spending patterns. Think smart nudges, trend analysis, and budget suggestions — all powered by AI down the road.

This is a passion project, actively in development.

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | [Expo SDK 54](https://expo.dev) / React Native 0.81 |
| Routing | [Expo Router 6](https://docs.expo.dev/router/introduction/) (file-based) |
| Backend | [Supabase](https://supabase.com) (Postgres, Auth, Row Level Security) |
| Styling | [NativeWind 4](https://www.nativewind.dev/) (Tailwind CSS for React Native) |
| State | [TanStack React Query 5](https://tanstack.com/query) |
| Forms | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev) validation |
| Language | TypeScript (strict mode) |

## Project Structure

```
budget-brain-native/
├── app/                        # Expo Router file-based routing
│   ├── (auth)/                 # Login & OTP verification
│   ├── (onboarding)/           # Profile setup, household creation/join
│   └── (app)/                  # Main app (tab navigation)
│       ├── index.tsx           # Overview / Dashboard
│       ├── plan.tsx            # Budget Planning
│       └── settings/           # Settings stack (account, theme, household, etc.)
├── components/
│   ├── ui/                     # Base UI primitives (Button, Card, Text, Input, etc.)
│   └── *.tsx                   # Feature components (forms, charts, lists)
├── contexts/                   # React Context providers
│   ├── auth-context.tsx        # Session & OTP auth flow
│   ├── month-context.tsx       # Selected budget month
│   └── theme-context.tsx       # Dark mode & app theme
├── hooks/                      # Custom React hooks (data fetching, auth, UI)
├── lib/
│   ├── queries/                # Supabase read operations
│   ├── mutations/              # Supabase write operations
│   ├── supabase.ts             # Supabase client init
│   ├── query-client.ts         # React Query config
│   ├── themes.ts               # App color themes
│   ├── utils.ts                # Helpers (currency formatting, date utils, etc.)
│   └── validations.ts          # Zod schemas for forms
├── types/
│   ├── index.ts                # App type definitions
│   └── supabase.ts             # Generated Supabase DB types
└── assets/images/              # App icons and images
```

## Features

- **Household budgeting** — one shared budget for the whole family
- **Category-based planning** — organize spending into categories with line items and planned amounts
- **Transaction tracking** — log expenses quickly, view history grouped by date
- **Income tracking** — track multiple income sources per month
- **Budget rollover** — automatically carry forward categories and planned amounts to the next month
- **Month navigation** — browse budgets across months
- **Multiple themes** — 6 app color themes (Ocean, Sunset, Forest, Berry, Midnight, Coral) + dark mode
- **Emoji avatars** — pick an emoji as your profile avatar
- **Household members** — invite family members, manage who has access

## Getting Started

### Prerequisites

- Node.js 18+
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for local Supabase)
- [Supabase CLI](https://supabase.com/docs/guides/cli) (`brew install supabase/tap/supabase`)
- iOS Simulator (Xcode) and/or Android Emulator (Android Studio)

### Local Development Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start Docker Desktop**

3. **Start local Supabase**

   ```bash
   supabase start
   ```

   This spins up a full Supabase stack locally (Postgres, Auth, Storage, etc.) and applies all migrations from `supabase/migrations/`. On first run it will pull Docker images which takes a few minutes.

4. **Environment variables**

   `.env.local` is auto-loaded by Expo during local dev and should point at the local Supabase instance:

   ```
   EXPO_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
   EXPO_PUBLIC_SUPABASE_ANON_KEY=<local-anon-key-from-supabase-start>
   ```

   Production env vars are set in `eas.json` under the `production` build profile.

5. **Start the app**

   ```bash
   npx expo start
   ```

### Local Supabase Commands

| Command | What it does |
|---------|-------------|
| `supabase start` | Start the local Supabase stack |
| `supabase stop` | Stop the local Supabase stack |
| `supabase status` | Show local URLs and keys |
| `supabase db reset` | Wipe local DB and re-apply all migrations |
| `supabase db diff -f <name>` | Auto-generate a migration from local schema changes |
| `supabase db push` | Apply migrations to the linked remote (production) database |
| `supabase db push --dry-run` | Preview what would be applied to production |

### Database Schema Workflow

All schema changes should be made **locally** and version-controlled as migrations:

1. Make changes locally (via SQL, local Studio at http://127.0.0.1:54323, or editing migration files)
2. Generate a migration: `supabase db diff -f describe_your_change`
3. Test locally: `supabase db reset`
4. Commit the migration file to git
5. Deploy to production: `supabase db push`

**Do not** make structural changes (tables, columns, RLS policies) directly in the production Supabase dashboard. Use the dashboard for read-only debugging and monitoring only.

### Supabase Schema

The app expects these tables (defined in `supabase/migrations/`):

- **users** — user profiles linked to Supabase Auth (email, name, avatar_emoji, household_id)
- **household** — shared household that users belong to
- **categories** — budget categories per month/year, scoped to a household
- **line_items** — individual budget line items under a category with planned amounts
- **transactions** — actual spending entries linked to line items
- **income** — income sources per month/year

Auth is configured for **email OTP** (magic code) — no passwords.

### Environments

| Environment | Supabase | Env vars loaded from |
|-------------|----------|---------------------|
| Local dev (`npx expo start`) | Local Docker (`http://127.0.0.1:54321`) | `.env.local` |
| Production (EAS build) | Remote Supabase project | `eas.json` `production.env` |

## Architecture Notes

These patterns are consistent across the codebase and worth understanding before diving in.

### Data Flow

```
Supabase DB
  → lib/queries/        (raw Supabase calls, return { data, error })
  → hooks/              (useQuery wrappers, combine loading states, shape data)
  → components/         (consume hooks, render UI)

User actions
  → components/         (forms, buttons)
  → lib/mutations/      (Supabase writes)
  → React Query         (cache invalidation triggers refetch)
```

### Query Pattern

All data fetching follows this pattern:

```typescript
// lib/queries/getSomething.ts
export async function getSomething(householdId: string, month: number, year: number) {
  const { data, error } = await supabase
    .from('table')
    .select('*')
    .eq('household_id', householdId)
    .eq('month', month)
    .eq('year', year);
  return { data, error };
}

// hooks/useSomething.ts
export function useSomething() {
  const { householdId } = useHousehold();
  const { month, year } = useMonth();
  return useQuery({
    queryKey: ['something', householdId, month, year],
    queryFn: () => getSomething(householdId!, month, year),
    enabled: !!householdId,
  });
}
```

### Routing

Expo Router file-based routing with three route groups:

1. `(auth)` — login and OTP verification
2. `(onboarding)` — profile setup and household creation (shown once)
3. `(app)` — main tab navigation (Overview, Budget Plan, Settings)

The root `index.tsx` acts as a router, directing users based on auth state and onboarding completion.

### Styling

NativeWind (Tailwind for React Native) with `className` props. Base UI components in `components/ui/` use `class-variance-authority` for variant management. The app supports 6 color themes and dark mode, managed via `ThemeContext`.
