import { z } from "zod";

// --- Primitives ---

function requiredString(fieldName: string) {
  return z.string().trim().min(1, `${fieldName} is required`);
}

function positiveAmountString(fieldName: string) {
  return z
    .string()
    .trim()
    .min(1, `${fieldName} is required`)
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: `${fieldName} must be a positive number`,
    });
}

const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .email("Please enter a valid email");

// --- Auth Schemas ---

export const loginSchema = z.object({
  email: emailSchema,
});
export type LoginFormData = z.infer<typeof loginSchema>;

// --- Onboarding Schemas ---

export const profileSchema = z.object({
  firstName: requiredString("First name"),
  lastName: z.string().trim(),
});
export type ProfileFormData = z.infer<typeof profileSchema>;

export const householdSchema = z.object({
  name: requiredString("Household name"),
});
export type HouseholdFormData = z.infer<typeof householdSchema>;

// --- Budget Schemas ---

export const addCategorySchema = z.object({
  categoryName: requiredString("Category name"),
});
export type AddCategoryFormData = z.infer<typeof addCategorySchema>;

export const editCategorySchema = z.object({
  name: requiredString("Category name"),
});
export type EditCategoryFormData = z.infer<typeof editCategorySchema>;

export const addIncomeSchema = z.object({
  name: requiredString("Name"),
  amount: positiveAmountString("Amount"),
});
export type AddIncomeFormData = z.infer<typeof addIncomeSchema>;

export const editIncomeSchema = z.object({
  name: requiredString("Name"),
  amount: positiveAmountString("Amount"),
});
export type EditIncomeFormData = z.infer<typeof editIncomeSchema>;

export const addLineItemSchema = z.object({
  name: requiredString("Name"),
  plannedAmount: positiveAmountString("Planned amount"),
});
export type AddLineItemFormData = z.infer<typeof addLineItemSchema>;

export const editLineItemSchema = z.object({
  name: requiredString("Name"),
  plannedAmount: positiveAmountString("Planned amount"),
});
export type EditLineItemFormData = z.infer<typeof editLineItemSchema>;

export const addExpenseSchema = z.object({
  amount: positiveAmountString("Amount"),
  description: z.string().trim(),
  lineItemId: z.string().min(1, "Please select a budget item"),
  date: requiredString("Date"),
});
export type AddExpenseFormData = z.infer<typeof addExpenseSchema>;

export const editTransactionSchema = z.object({
  amount: positiveAmountString("Amount"),
  description: z.string().trim(),
  lineItemId: z.string().min(1, "Please select a budget item"),
  date: requiredString("Date"),
});
export type EditTransactionFormData = z.infer<typeof editTransactionSchema>;

export const changePasswordSchema = z
  .object({
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
