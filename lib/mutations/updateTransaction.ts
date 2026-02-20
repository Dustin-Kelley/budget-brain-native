import { supabase } from '@/lib/supabase';
import { getMonthAndYearNumberFromDate } from '@/lib/utils';

export async function updateTransaction({
  transactionId,
  amount,
  description,
  lineItemId,
  dateOfTransaction,
  monthKey,
  householdId,
  userId,
}: {
  transactionId: string;
  amount: number;
  description?: string;
  lineItemId: string;
  dateOfTransaction: string;
  monthKey: string;
  householdId: string;
  userId: string;
}): Promise<{ error: Error | null }> {
  const { monthNumber, yearNumber } = getMonthAndYearNumberFromDate(monthKey);

  const { error } = await supabase
    .from('transactions')
    .update({
      amount,
      description: description ?? null,
      date: dateOfTransaction,
      line_item_id: lineItemId,
      year: yearNumber,
      month: monthNumber,
      household_id: householdId,
      created_by: userId,
    })
    .eq('id', transactionId);

  if (error) return { error: error as Error };
  return { error: null };
}
