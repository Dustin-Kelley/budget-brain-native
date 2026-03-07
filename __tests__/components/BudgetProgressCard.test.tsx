import React from "react";
import { render, screen } from "@testing-library/react-native";
import { BudgetProgressCard } from "@/components/BudgetProgressCard";

// ============================================================
// COMPONENT TEST EXAMPLE — BudgetProgressCard
// ============================================================
// Component tests render a React component in a simulated environment
// and verify that the right text/elements appear on screen.
//
// Key ideas:
//   - render()        → mounts the component in a virtual tree
//   - screen.getByText() → finds an element by its visible text
//   - expect(...).toBeTruthy() → asserts the element exists
//
// We mock out dependencies that aren't relevant to the test
// (theme context, animated components) so the test stays focused
// on the component's own rendering logic.
// ============================================================

// Mock the theme context so the component doesn't crash outside the app
jest.mock("@/contexts/theme-context", () => ({
  useTheme: () => ({ appTheme: "default" }),
}));

// Mock the themes module to return a simple theme object
jest.mock("@/lib/themes", () => ({
  getAppTheme: () => ({ colors: ["#0ea5e9", "#6366f1"] }),
}));

// Mock AnimatedProgressBar since it uses react-native-reanimated internals
jest.mock("@/components/AnimatedProgressBar", () => ({
  AnimatedProgressBar: () => null,
}));

describe("BudgetProgressCard", () => {
  it("renders the budget progress with correct amounts", () => {
    // ARRANGE: render the component with known props
    render(
      <BudgetProgressCard
        totalPlanned={2000}
        spentAmount={750}
        percentSpent={38}
      />
    );

    // ASSERT: check that the key text is visible
    expect(screen.getByText("Overall Budget Progress")).toBeTruthy();
    expect(screen.getByText(/Spent: \$750 \(38%\)/)).toBeTruthy();
    expect(screen.getByText(/\$0 – \$2,000/)).toBeTruthy();
  });

  it("shows an error message when error prop is set", () => {
    render(
      <BudgetProgressCard
        totalPlanned={0}
        spentAmount={0}
        percentSpent={0}
        error="Something went wrong"
      />
    );

    expect(screen.getByText("Error loading progress")).toBeTruthy();
  });
});
