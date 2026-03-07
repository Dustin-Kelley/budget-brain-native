import {
  formatCurrency,
  hexToRgba,
  blendHex,
  getMonthAndYearNumberFromDate,
  formatMonthYearForDisplay,
  getMonthYearString,
} from "@/lib/utils";

// ============================================================
// UNIT TEST EXAMPLE — lib/utils.ts
// ============================================================
// Unit tests verify small, isolated pieces of logic (pure functions).
// They're the fastest to write and run, and give you the most confidence
// per line of test code because the functions have no side effects.
//
// Structure of every test:
//   1. ARRANGE — set up inputs
//   2. ACT    — call the function
//   3. ASSERT — check the output matches what you expect
// ============================================================

describe("formatCurrency", () => {
  // A simple test: does the default (0 decimal places) work?
  it("formats whole dollars by default", () => {
    expect(formatCurrency(1234)).toBe("$1,234");
  });

  // Test with an option — does fractionDigits work?
  it("formats with cents when fractionDigits is 2", () => {
    expect(formatCurrency(1234.5, { fractionDigits: 2 })).toBe("$1,234.50");
  });

  // Edge case: zero
  it("formats zero", () => {
    expect(formatCurrency(0)).toBe("$0");
  });

  // Edge case: negative numbers
  it("formats negative amounts", () => {
    expect(formatCurrency(-50)).toBe("-$50");
  });
});

describe("hexToRgba", () => {
  it("converts a hex color to rgba", () => {
    expect(hexToRgba("#0ea5e9", 0.5)).toBe("rgba(14, 165, 233, 0.5)");
  });

  it("handles full opacity", () => {
    expect(hexToRgba("#000000", 1)).toBe("rgba(0, 0, 0, 1)");
  });
});

describe("blendHex", () => {
  it("returns first color at ratio 0", () => {
    expect(blendHex("#ff0000", "#0000ff", 0)).toBe("#ff0000");
  });

  it("returns second color at ratio 1", () => {
    expect(blendHex("#ff0000", "#0000ff", 1)).toBe("#0000ff");
  });

  it("blends 50/50 by default", () => {
    // #ff0000 and #0000ff at 0.5 → midpoint
    const result = blendHex("#ff0000", "#0000ff");
    expect(result).toBe("#800080");
  });
});

describe("getMonthAndYearNumberFromDate", () => {
  it("parses 'January-2025' into month 1, year 2025", () => {
    const result = getMonthAndYearNumberFromDate("January-2025");
    expect(result).toEqual({ monthNumber: 1, yearNumber: 2025 });
  });

  it("parses 'December-2024' into month 12, year 2024", () => {
    const result = getMonthAndYearNumberFromDate("December-2024");
    expect(result).toEqual({ monthNumber: 12, yearNumber: 2024 });
  });

  it("returns current month/year when undefined", () => {
    const result = getMonthAndYearNumberFromDate(undefined);
    const now = new Date();
    expect(result.monthNumber).toBe(now.getMonth() + 1);
    expect(result.yearNumber).toBe(now.getFullYear());
  });
});

describe("formatMonthYearForDisplay", () => {
  it("replaces dash with space", () => {
    expect(formatMonthYearForDisplay("March-2025")).toBe("March 2025");
  });
});

describe("getMonthYearString", () => {
  it("builds a month-year string from numbers", () => {
    expect(getMonthYearString(3, 2025)).toBe("March-2025");
  });

  it("handles December", () => {
    expect(getMonthYearString(12, 2024)).toBe("December-2024");
  });
});
