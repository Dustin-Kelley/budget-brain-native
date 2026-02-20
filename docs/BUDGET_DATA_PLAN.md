# Budget Brain Native – Budget Data Implementation Plan

This plan maps the web app’s budget behavior to the native app and breaks it into ordered steps.

---

## Data Model Summary

| Table       | Purpose                                                                 |
|------------|-------------------------------------------------------------------------|
| `users`    | User profile; `household_id` links to household                         |
| `household`| Household container for shared budgets                                  |
| `categories` | Budget categories per month/year (e.g. Groceries, Rent)              |
| `line_items` | Line items per category with `planned_amount`                         |
| `income`   | Income entries per month/year                                           |
| `transactions` | Actual spending per month/year                                      |

All budget queries use `household_id` from the current user.

---

## Phase 1: Data Layer (Foundation)

### 1.1 lib/utils.ts

- [ ] `getMonthAndYearNumberFromDate(date?: string)` – parse month/year from optional date string
- [ ] `formatMonthYearForDisplay(monthStr?: string)` – e.g. `"January 2025"`
- [ ] `getMonthYearString(month: number, year: number)` – e.g. `"January-2025"` for query params

### 1.2 getCurrentUser (profile with household_id)

- [ ] Query `users` by auth user id
- [ ] Return `currentUser` (with `household_id`) or `null`
- [ ] Add to `contexts/auth-context.tsx` or new `contexts/user-context.tsx` so `household_id` is available

### 1.3 Queries (lib/queries/ or hooks/useBudgetQueries.ts)

| Query                  | Input        | Returns                                               |
|------------------------|-------------|--------------------------------------------------------|
| `getCategories`        | `date`, `householdId` | Categories with `line_items`                       |
| `getTotalPlannedAmount`| `date`, `householdId` | Sum of all `line_items.planned_amount`            |
| `getSpentAmount`       | `date`, `householdId` | Sum of `transactions.amount` for month/year       |
| `getTotalIncome`       | `date`, `householdId`, `userId` | Income entries and total income              |

---

## Phase 2: Month Selector & Shared State

### 2.1 Month state

- [ ] Store selected month (e.g. `"January-2025"`) in context or URL param
- [ ] Default to current month
- [ ] Use same value in Overview and Plan

### 2.2 MonthSelector component

- [ ] Display `"January 2025"`
- [ ] Prev/Next buttons
- [ ] Optional: date picker for direct month selection

---

## Phase 3: Overview Screen

### 3.1 Layout

```
┌─────────────────────────────────┐
│  < Month Selector >             │
├─────────────────────────────────┤
│  Overall Budget Progress        │
│  ━━━━━━━━━━━━━━░░░░ 75%         │
│  Spent: $750    $0 ─── $1,000   │
├─────────────────────────────────┤
│  Budget Summary                 │
│  ┌─────────┬─────────┬─────────┐│
│  │ Planned │  Spent  │Remaining││
│  │ $1,000  │  $750   │  $250   ││
│  └─────────┴─────────┴─────────┘│
├─────────────────────────────────┤
│  Spending by Category           │
│  (List or simple chart)         │
└─────────────────────────────────┘
```

### 3.2 Components

- [ ] `BudgetProgressCard` – progress bar, spent vs total
- [ ] `BudgetSummaryCards` – Planned / Spent / Remaining
- [ ] `CategorySpendingList` – list of categories with spent amounts (or pie chart later)

### 3.3 Empty states

- [ ] No budget: “Plan your budget” → link to Plan
- [ ] No transactions: show $0 spent

---

## Phase 4: Plan Screen (Read-Only First)

### 4.1 Layout (matches web tabs)

```
┌─────────────────────────────────┐
│  < Month Selector >             │
├─────────────────────────────────┤
│  Income                         │
│  Total: $X,XXX                  │
│  [Entries list]                 │
├─────────────────────────────────┤
│  [ Planned | Remaining | Trans ]│
├─────────────────────────────────┤
│  Tab content                    │
└─────────────────────────────────┘
```

### 4.2 Tabs

| Tab           | Content                                                                 |
|---------------|-------------------------------------------------------------------------|
| **Planned**   | Categories with line items and planned amounts                          |
| **Remaining** | Categories with remaining (planned − spent) per line item               |
| **Transactions** | Transactions for the month with description, amount, date          |

### 4.3 Components (read-only)

- [ ] `IncomeCard` – total income and list of income entries
- [ ] `CategoryCards` – expandable categories with line items
- [ ] `LineItemsList` – line items with planned amounts
- [ ] `RemainingSpentCards` – category breakdown with remaining amounts
- [ ] `TransactionsList` – transactions for the month

---

## Phase 5: Add Expense (Overview)

### 5.1 AddExpenseForm

- [ ] Modal or inline form
- [ ] Fields: Amount, Description, Category, Line Item, Date
- [ ] Insert into `transactions`

---

## Phase 6: Plan Screen – Create/Edit (Future)

- [x] Add income
- [x] Add category
- [x] Add line item
- [x] Edit line item (planned amount)
- [x] Add expense from Plan
- [x] Edit/delete transaction

---

## File Structure

```
lib/
  utils.ts              # Date/month helpers
  queries/
    getCurrentUser.ts
    getCategories.ts
    getTotalPlannedAmount.ts
    getSpentAmount.ts
    getTotalIncome.ts
  constants.ts          # categoryColors for charts

contexts/
  auth-context.tsx      # (existing)
  user-context.tsx      # currentUser (household_id)
  month-context.tsx     # selected month for Overview/Plan

components/
  MonthSelector.tsx
  BudgetProgressCard.tsx
  BudgetSummaryCards.tsx
  CategorySpendingList.tsx

app/(app)/
  index.tsx             # Overview – uses budget data
  plan.tsx              # Plan – tabs + read-only content
  settings.tsx          # (existing)
```

---

## Recommended Order

1. **Phase 1** – Utils, `getCurrentUser`, queries, user/month context  
2. **Phase 2** – Month selector and shared month state  
3. **Phase 3** – Overview with progress, summary, and category list  
4. **Phase 4** – Plan read-only (income, categories, transactions)  
5. **Phase 5** – Add expense from Overview  

---

## Notes

- Use React Query or SWR for caching and refetch if preferred; plain `useState` + `useEffect` works for MVP.
- Start with read-only views; add forms and mutations after data display works.
- For charts, consider `react-native-gifted-charts` or `victory-native` for mobile-friendly visuals.
- Web uses `month` query param (e.g. `?month=January-2025`); native can use context or expo-router params.
