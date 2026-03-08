import {
  loginSchema,
  addExpenseSchema,
  addLineItemSchema,
  changePasswordSchema,
} from "@/lib/validations";

// ============================================================
// UNIT TEST EXAMPLE — Zod validation schemas
// ============================================================
// These tests verify that your form validation rules work correctly.
// For each schema you test two things:
//   1. Valid input is accepted (no errors)
//   2. Invalid input is rejected with the right error message
// ============================================================

describe("loginSchema", () => {
  it("accepts a valid email", () => {
    const result = loginSchema.safeParse({ email: "user@example.com" });
    expect(result.success).toBe(true);
  });

  it("rejects an empty email", () => {
    const result = loginSchema.safeParse({ email: "" });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email format", () => {
    const result = loginSchema.safeParse({ email: "not-an-email" });
    expect(result.success).toBe(false);
  });
});

describe("addExpenseSchema", () => {
  const validExpense = {
    amount: "50.00",
    description: "Groceries",
    lineItemId: "abc-123",
    date: "2025-03-01",
  };

  it("accepts valid expense data", () => {
    const result = addExpenseSchema.safeParse(validExpense);
    expect(result.success).toBe(true);
  });

  it("rejects zero amount", () => {
    const result = addExpenseSchema.safeParse({ ...validExpense, amount: "0" });
    expect(result.success).toBe(false);
  });

  it("rejects negative amount", () => {
    const result = addExpenseSchema.safeParse({
      ...validExpense,
      amount: "-10",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing line item", () => {
    const result = addExpenseSchema.safeParse({
      ...validExpense,
      lineItemId: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("addLineItemSchema", () => {
  it("accepts valid line item", () => {
    const result = addLineItemSchema.safeParse({
      name: "Rent",
      plannedAmount: "1200",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty name", () => {
    const result = addLineItemSchema.safeParse({
      name: "",
      plannedAmount: "1200",
    });
    expect(result.success).toBe(false);
  });

  it("rejects non-numeric planned amount", () => {
    const result = addLineItemSchema.safeParse({
      name: "Rent",
      plannedAmount: "abc",
    });
    expect(result.success).toBe(false);
  });
});

describe("changePasswordSchema", () => {
  it("accepts matching passwords of 6+ characters", () => {
    const result = changePasswordSchema.safeParse({
      newPassword: "secret123",
      confirmPassword: "secret123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects password shorter than 6 characters", () => {
    const result = changePasswordSchema.safeParse({
      newPassword: "abc",
      confirmPassword: "abc",
    });
    expect(result.success).toBe(false);
  });

  it("rejects non-matching passwords", () => {
    const result = changePasswordSchema.safeParse({
      newPassword: "secret123",
      confirmPassword: "different456",
    });
    expect(result.success).toBe(false);
  });
});
