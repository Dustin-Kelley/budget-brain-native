import { supabase } from '@/lib/supabase';
import { getMonthAndYearNumberFromDate, getMonthYearString } from '@/lib/utils';

/**
 * Searches up to 12 months back from `beforeMonthKey` for a month that has
 * at least one category (i.e. a budget exists). Returns the monthKey string
 * or null if nothing is found.
 */
export async function findMostRecentBudgetMonth(
  householdId: string,
  beforeMonthKey: string,
): Promise<string | null> {
  const { monthNumber, yearNumber } = getMonthAndYearNumberFromDate(beforeMonthKey);

  for (let i = 1; i <= 12; i++) {
    let m = monthNumber - i;
    let y = yearNumber;
    while (m <= 0) {
      m += 12;
      y -= 1;
    }

    const { count, error } = await supabase
      .from('categories')
      .select('id', { count: 'exact', head: true })
      .eq('household_id', householdId)
      .eq('month', m)
      .eq('year', y);

    if (error) continue;
    if (count && count > 0) {
      return getMonthYearString(m, y);
    }
  }

  return null;
}
