import { supabase } from "@/lib/supabase";
import { getMonthAndYearNumberFromDate } from "@/lib/utils";

export type CategorySpent = { category_id: string; category_name: string | null; spent: number };

export async function getSpentByCategory({
  date,
  householdId,
}: {
  date: string | undefined;
  householdId: string | null;
}): Promise<{ categorySpent: CategorySpent[]; error: Error | null }> {
  if (!householdId) {
    return { categorySpent: [], error: null };
  }

  const { monthNumber, yearNumber } = getMonthAndYearNumberFromDate(date);

  const { data: transactions, error: txError } = await supabase
    .from("transactions")
    .select("amount, line_item_id")
    .eq("household_id", householdId)
    .eq("month", monthNumber)
    .eq("year", yearNumber);

  if (txError) {
    return { categorySpent: [], error: txError as Error };
  }

  const lineItemIds = [
    ...new Set(
      (transactions ?? [])
        .map((t) => t.line_item_id)
        .filter((id): id is string => !!id)
    ),
  ];

  if (lineItemIds.length === 0) {
    return { categorySpent: [], error: null };
  }

  const { data: lineItems, error: liError } = await supabase
    .from("line_items")
    .select("id, category_id")
    .in("id", lineItemIds);

  if (liError) {
    return { categorySpent: [], error: liError as Error };
  }

  const lineItemToCategory = new Map(
    (lineItems ?? []).map((li) => [li.id, li.category_id])
  );

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .in("id", [...new Set(lineItemToCategory.values())]);

  const categoryNames = new Map(
    (categories ?? []).map((c) => [c.id, c.name])
  );

  const spentByCategory = new Map<string, number>();

  for (const tx of transactions ?? []) {
    const amount = tx.amount ?? 0;
    const categoryId = tx.line_item_id
      ? lineItemToCategory.get(tx.line_item_id)
      : null;
    if (categoryId) {
      spentByCategory.set(
        categoryId,
        (spentByCategory.get(categoryId) ?? 0) + amount
      );
    }
  }

  const categorySpent: CategorySpent[] = [...spentByCategory.entries()].map(
    ([category_id, spent]) => ({
      category_id,
      category_name: categoryNames.get(category_id) ?? null,
      spent,
    })
  );

  return { categorySpent, error: null };
}
