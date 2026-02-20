import { supabase } from '@/lib/supabase';
import { getMonthAndYearNumberFromDate } from '@/lib/utils';

export async function addCategory({
  categoryName,
  monthKey,
  householdId,
}: {
  categoryName: string;
  monthKey: string;
  householdId: string;
}): Promise<{ error: Error | null }> {
  const { monthNumber, yearNumber } = getMonthAndYearNumberFromDate(monthKey);

  const { error } = await supabase.from('categories').insert({
    name: categoryName,
    household_id: householdId,
    month: monthNumber,
    year: yearNumber,
  });

  if (error) return { error: error as Error };
  return { error: null };
}
