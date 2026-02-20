import { supabase } from '@/lib/supabase';
import { getMonthAndYearNumberFromDate } from '@/lib/utils';

export async function addTransaction({
  amount,
  description,
  lineItemId,
  dateOfTransaction,
  householdId,
  userId,
  monthKey,
}: {
  amount: number;
  description?: string;
  lineItemId: string;
  dateOfTransaction: string;
  householdId: string;
  userId: string;
  monthKey: string;
}): Promise<{ error: Error | null }> {
  const { monthNumber, yearNumber } = getMonthAndYearNumberFromDate(monthKey);

  const { error } = await supabase.from('transactions').insert({
    amount,
    description: description ?? null,
    date: dateOfTransaction,
    line_item_id: lineItemId,
    year: yearNumber,
    month: monthNumber,
    household_id: householdId,
    created_by: userId,
  });

  if (error) {
    return { error: error };
  }
  return { error: null };
}
