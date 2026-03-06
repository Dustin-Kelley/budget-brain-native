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
- iOS Simulator (Xcode) and/or Android Emulator (Android Studio)
- A [Supabase](https://supabase.com) project

### Environment Variables

Create a `.env` file in the project root:

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Install & Run

```bash
# Install dependencies
npm install

# Start the dev server
npx expo start

# Or run directly on a platform
npx expo run:ios
npx expo run:android
```

### Supabase Setup

The app expects these tables in your Supabase project:

- **users** — user profiles linked to Supabase Auth (email, name, avatar_emoji, household_id)
- **household** — shared household that users belong to
- **categories** — budget categories per month/year, scoped to a household
- **line_items** — individual budget line items under a category with planned amounts
- **transactions** — actual spending entries linked to line items
- **income** — income sources per month/year

Auth is configured for **email OTP** (magic code) — no passwords.

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
