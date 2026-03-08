// ============================================================
// INTEGRATION TEST EXAMPLE — useBudgetOverview hook
// ============================================================
// Integration tests verify that multiple pieces work together.
// Here we test a custom hook that combines React Query, context,
// and Supabase query functions.
//
// Key ideas:
//   - renderHook() — mounts a hook outside of a component
//   - wrapper      — provides the React Query + context providers
//   - jest.mock()  — replaces real API calls with fake data
//   - waitFor()    — waits for async state updates to settle
//
// We mock the Supabase query functions and context hooks so we
// can control exactly what data the hook receives, then verify
// it computes the right derived values (totalPlanned, remaining, etc.)
// ============================================================

import { renderHook, waitFor } from "@testing-library/react-native";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useBudgetOverview } from "@/hooks/useBudgetOverview";

// --- Mock dependencies ---

// Mock the month context to return a fixed month
jest.mock("@/contexts/month-context", () => ({
  useMonth: () => ({ monthKey: "March-2025" }),
}));

// Mock the household hook to return a fixed household ID
jest.mock("@/hooks/useHousehold", () => ({
  useHousehold: () => ({ householdId: "test-household-id" }),
}));

// Mock the Supabase query functions with fake data
jest.mock("@/lib/queries/getCategories", () => ({
  getCategories: jest.fn().mockResolvedValue({
    categories: [
      {
        id: "cat-1",
        name: "Housing",
        line_items: [
          { planned_amount: 1200 },
          { planned_amount: 300 },
        ],
      },
      {
        id: "cat-2",
        name: "Food",
        line_items: [{ planned_amount: 500 }],
      },
    ],
    error: null,
  }),
}));

jest.mock("@/lib/queries/getSpentAmount", () => ({
  getSpentAmount: jest.fn().mockResolvedValue({
    spentAmount: 800,
    error: null,
  }),
}));

jest.mock("@/lib/queries/getSpentByCategory", () => ({
  getSpentByCategory: jest.fn().mockResolvedValue({
    categorySpent: [
      { category_id: "cat-1", total: 600 },
      { category_id: "cat-2", total: 200 },
    ],
    error: null,
  }),
}));

// --- Test setup ---

// Create a fresh QueryClient for each test so tests don't share cache
function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Don't retry failed queries in tests
      },
    },
  });
}

// A wrapper component that provides the QueryClient context
function createWrapper() {
  const queryClient = createTestQueryClient();
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(
      QueryClientProvider,
      { client: queryClient },
      children
    );
  };
}

// --- Tests ---

describe("useBudgetOverview", () => {
  it("computes totalPlanned, remaining, and percentSpent from query data", async () => {
    // ARRANGE & ACT: render the hook with providers
    const { result } = renderHook(() => useBudgetOverview(), {
      wrapper: createWrapper(),
    });

    // ASSERT: wait for queries to resolve, then check computed values
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // totalPlanned = 1200 + 300 + 500 = 2000
    expect(result.current.totalPlanned).toBe(2000);

    // spentAmount comes from the mock = 800
    expect(result.current.spentAmount).toBe(800);

    // remaining = totalPlanned - spentAmount = 2000 - 800 = 1200
    expect(result.current.remaining).toBe(1200);

    // percentSpent = round(800 / 2000 * 100) = 40
    expect(result.current.percentSpent).toBe(40);

    // categorySpent comes through from the mock
    expect(result.current.categorySpent).toHaveLength(2);

    // no error
    expect(result.current.error).toBeNull();
  });
});
