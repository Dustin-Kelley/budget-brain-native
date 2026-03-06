# Agent guidelines

This file gives coding agents (AI or human) consistent style and patterns to follow in this repo.

---

## Human-readable code

Code should be easy for a human to read and understand. When opening any module, the flow and intent should be clear without mental parsing.

- **Prefer `if` statements over ternaries** when you have a choice. Ternaries are fine for very short, inline values (e.g. a single class or attribute). For branching logic or multi-line outcomes, use `if`/`else` so the reader sees one path at a time.
- **Return whole component blocks** instead of scattering many small conditionals inside JSX. For example: compute what to show with `if`/`else` (or a small helper), then return one clear block (e.g. a single `<View>...</View>` or fragment). Avoid patterns like `{loading && <Spinner />}{error && <Error />}{data && <Content />}` in the middle of the tree—prefer early returns or a single “chosen” block so the component reads top-to-bottom.
- **One idea per place**: structure files so that anyone can skim and quickly understand what the code is doing. Spell out steps and names; avoid clever one-liners when a few clear lines would be easier to follow.

---

## UI and styling

- **Prefer project UI components** over raw React Native primitives when the project provides them (e.g. buttons, cards, inputs from your design system).
- **Use NativeWind** for styling (Tailwind-style classes) instead of `StyleSheet` or inline style objects. Stay consistent with the rest of the app’s styling approach.

---

## React

- **Use `useEffect` only as an escape hatch** to sync with external or third-party systems (browser APIs, native modules, subscriptions, etc.). Do not use it for derived state or logic that can be expressed during render or with other React patterns.

---

## TypeScript

- **Infer types as much as possible.** Let TypeScript infer types from values, function returns, and generics instead of writing explicit annotations everywhere.
- **Don’t manually type unless necessary.** Add type annotations only when inference isn’t enough (e.g. public API boundaries, ambiguous literals, or when the compiler needs help).
- **Avoid type casts** (`as`, type assertions) unless we are certain they are required. Prefer fixing the types (narrowing, better generics, or typing the source) so the need for a cast goes away.
- **Prioritize clean types:** well-shaped data and clear interfaces over casting or `any` to unblock. If types are awkward, improve the design rather than forcing the type system.

---

## Query hooks (TanStack Query / React Query)

Use this convention for all query hooks so behavior and return shapes stay consistent.

### useQuery call

- Use the **object form** of `useQuery` with explicit `queryKey`, `queryFn`, and `enabled`.
- **queryKey**: Array with a string identifier and any values the query depends on, e.g. `['household', householdId]` or `['currentUser', authUser?.id]`.
- **queryFn**: Call the fetch function from `@/lib/queries/`. Use `async () => { ... }` when you need to return a shaped object (e.g. `{ household, error }`), or `() => getSomething(...)` when the lib already returns the right shape.
- **enabled**: Set to `!!dependency` whenever the query should not run until a value exists (e.g. `enabled: !!householdId`, `enabled: !!authUser?.id`).

Example:

```ts
const { data, isLoading } = useQuery({
  queryKey: ['household', householdId],
  queryFn: async () => {
    const { household, error } = await getHousehold(householdId);
    return { household, error };
  },
  enabled: !!householdId,
});
```

### Hook return shape

- **Normalize data**: Expose values with null/empty defaults (e.g. `data?.household ?? null`, `data?.categories ?? []`) so consumers never see `undefined` for the main payload.
- **Single loading flag**: Combine loading from any dependencies (e.g. auth, household) with the query’s `isLoading` and expose one flag, e.g. `isLoading: isCurrentUserLoading || isLoading`.
- **Named, explicit return**: Return a clear object (e.g. `{ householdId, household, isLoading }`) rather than returning the raw `useQuery` result.

### Invalidation

- When callers need to invalidate a query, export a **separate hook** that returns an invalidation function, e.g. `useInvalidateHousehold`, and keep the main hook focused on data and loading.

  ```ts
  export const useInvalidateHousehold = () => {
    const queryClient = useQueryClient();
    return () => {
      queryClient.invalidateQueries({ queryKey: ['household'] });
    };
  };
  ```

### Naming and placement

- Hook names: `useHousehold`, `useCurrentUser`, `useBudgetPlan`, etc.
- Invalidation hooks: `useInvalidateHousehold`, `useInvalidate…`.
- Export with `export function useHousehold()` (function declaration).
- Fetch logic lives in `@/lib/queries/`; hooks in `hooks/` only orchestrate `useQuery` and shape the return value.

Reference implementations: `hooks/useHousehold.ts`, `hooks/useCurrentUser.ts`.

### Error logging

Log errors as close to the source as possible. Never use `useEffect` to watch error state for logging.

- **Queries (`lib/queries/`)**: Call standalone `logError()` right where the error is detected, before returning `{ ..., error }`. The server function is the source of the error, so it logs it. Query hooks do NOT log — they just throw to let React Query handle the error state.
- **Mutations (`hooks/use*.ts`)**: Use `useMutation`’s `onError` callback. This is where you call `useLogError()` (the hook version, with user context). The mutation hook is the closest place to the error that has React context.
- **Auth flows** (not React Query): Call standalone `logError()` at the call site in the component, right after receiving the error from `sendOtp`/`verifyOtp`.

Two forms of `logError` (from `hooks/useLogError.ts`):
- `logError()` — standalone function, no user context. Use in `lib/queries/`, `lib/mutations/`, and non-React code.
- `useLogError()` — hook, attaches current user to Sentry. Use in React components and hooks. **Cannot be used in `useCurrentUser` or `useHousehold`** (circular dependency).

Always include tags: `{ tags: { query: ‘getFoo’ } }` for queries, `{ tags: { feature: ‘transactions’ } }` for mutations.

Reference: `hooks/useAutoRollover.ts` (mutation with `onError` and `useLogError`), `lib/queries/getCategories.ts` (query with standalone `logError`).
