import type { Database } from "@/types/supabase";

export type UserRow = Database["public"]["Tables"]["users"]["Row"];
export type HouseholdRow = Database["public"]["Tables"]["household"]["Row"];
export type Transaction =
  Database["public"]["Tables"]["transactions"]["Row"];
export type LineItem = Database["public"]["Tables"]["line_items"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];

export type CategoryWithLineItems = Category & {
  line_items: LineItem[];
};

export type TransactionWithLineItem = Database["public"]["Tables"]["transactions"]["Row"] & {
  line_items?: {
    name?: string | null;
    categories?: {
      name?: string | null;
    } | null;
  } | null;
};
