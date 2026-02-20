import { supabase } from '@/lib/supabase';
import { getMonthAndYearNumberFromDate } from '@/lib/utils';

export async function addLineItem({
  lineItemName,
  categoryId,
  plannedAmount,
  monthKey,
  userId,
}: {
  lineItemName: string;
  categoryId: string;
  plannedAmount: number;
  monthKey: string;
  userId: string;
}): Promise<{ error: Error | null }> {
  const { monthNumber, yearNumber } = getMonthAndYearNumberFromDate(monthKey);

  const { error } = await supabase.from('line_items').insert({
    name: lineItemName,
    category_id: categoryId,
    created_by: userId,
    planned_amount: plannedAmount,
    month: monthNumber,
    year: yearNumber,
  });

  if (error) return { error: error as Error };
  return { error: null };
}
