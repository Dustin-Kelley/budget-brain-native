import { supabase } from '@/lib/supabase';
import { getMonthAndYearNumberFromDate } from '@/lib/utils';

/**
 * Non-destructive rollover: copies categories, line items, and income from
 * one month to another WITHOUT deleting any existing data in the target month.
 */
export async function autoRolloverBudget({
  householdId,
  fromMonthKey,
  toMonthKey,
  userId,
}: {
  householdId: string;
  fromMonthKey: string;
  toMonthKey: string;
  userId: string;
}): Promise<{ error: Error | null }> {
  const from = getMonthAndYearNumberFromDate(fromMonthKey);
  const to = getMonthAndYearNumberFromDate(toMonthKey);

  // Fetch source categories
  const { data: categories, error: catFetchError } = await supabase
    .from('categories')
    .select('*')
    .eq('household_id', householdId)
    .eq('month', from.monthNumber)
    .eq('year', from.yearNumber);

  if (catFetchError) return { error: catFetchError as Error };

  // Fetch source line items
  const categoryIds = (categories ?? []).map((c) => c.id);
  let allLineItems: { name: string | null; planned_amount: number | null; category_id: string }[] = [];
  if (categoryIds.length > 0) {
    const { data, error: liFetchError } = await supabase
      .from('line_items')
      .select('name, planned_amount, category_id')
      .in('category_id', categoryIds);
    if (liFetchError) return { error: liFetchError as Error };
    allLineItems = data ?? [];
  }

  const lineItemsByCategory = new Map<string, typeof allLineItems>();
  for (const li of allLineItems) {
    const catId = li.category_id;
    if (!lineItemsByCategory.has(catId)) lineItemsByCategory.set(catId, []);
    lineItemsByCategory.get(catId)!.push(li);
  }

  // Fetch source income
  const { data: income, error: incFetchError } = await supabase
    .from('income')
    .select('*')
    .eq('household_id', householdId)
    .eq('month', from.monthNumber)
    .eq('year', from.yearNumber);

  if (incFetchError) return { error: incFetchError as Error };

  // Insert categories and line items (no deletion)
  for (const cat of categories ?? []) {
    const { data: newCat, error: insertCatError } = await supabase
      .from('categories')
      .insert({
        name: cat.name,
        household_id: householdId,
        month: to.monthNumber,
        year: to.yearNumber,
      })
      .select('id')
      .single();

    if (insertCatError) return { error: insertCatError as Error };

    const catLineItems = lineItemsByCategory.get(cat.id) ?? [];
    const lineItems = catLineItems.map((li) => ({
      name: li.name,
      planned_amount: li.planned_amount,
      category_id: newCat.id,
      month: to.monthNumber,
      year: to.yearNumber,
      created_by: userId,
    }));

    if (lineItems.length > 0) {
      const { error: insertLiError } = await supabase
        .from('line_items')
        .insert(lineItems);

      if (insertLiError) return { error: insertLiError as Error };
    }
  }

  // Insert income (no deletion)
  const incomeInserts = (income ?? []).map((inc) => ({
    name: inc.name,
    amount: inc.amount,
    household_id: householdId,
    month: to.monthNumber,
    year: to.yearNumber,
    created_by: userId,
  }));

  if (incomeInserts.length > 0) {
    const { error: insertIncError } = await supabase
      .from('income')
      .insert(incomeInserts);

    if (insertIncError) return { error: insertIncError as Error };
  }

  return { error: null };
}
