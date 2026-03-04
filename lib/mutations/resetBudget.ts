import { supabase } from '@/lib/supabase';
import { getMonthAndYearNumberFromDate } from '@/lib/utils';

export async function resetBudget({
  householdId,
  monthKey,
}: {
  householdId: string;
  monthKey: string;
}): Promise<{ error: Error | null }> {
  const { monthNumber, yearNumber } = getMonthAndYearNumberFromDate(monthKey);

  // Delete categories (cascade deletes line_items)
  const { error: catError } = await supabase
    .from('categories')
    .delete()
    .eq('household_id', householdId)
    .eq('month', monthNumber)
    .eq('year', yearNumber);

  if (catError) return { error: catError as Error };

  // Delete income
  const { error: incError } = await supabase
    .from('income')
    .delete()
    .eq('household_id', householdId)
    .eq('month', monthNumber)
    .eq('year', yearNumber);

  if (incError) return { error: incError as Error };

  return { error: null };
}
