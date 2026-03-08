import { supabase } from '@/lib/supabase';
import { getMonthAndYearNumberFromDate } from '@/lib/utils';

export async function addCategory({
  categoryName,
  monthKey,
  householdId,
  color,
}: {
  categoryName: string;
  monthKey: string;
  householdId: string;
  color?: string;
}) {
  const { monthNumber, yearNumber } = getMonthAndYearNumberFromDate(monthKey);

  const { error } = await supabase.from('categories').insert({
    name: categoryName,
    household_id: householdId,
    month: monthNumber,
    year: yearNumber,
    ...(color ? { color } : {}),
  });

  if (error) throw error;
}
