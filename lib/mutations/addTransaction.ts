import { supabase } from '@/lib/supabase';
import { getMonthAndYearNumberFromDate, computeNextRecurringDate } from '@/lib/utils';

export async function addTransaction({
  amount,
  description,
  note,
  lineItemId,
  dateOfTransaction,
  householdId,
  userId,
  monthKey,
  recurrenceFrequency = 'never',
}: {
  amount: number;
  description?: string;
  note?: string;
  lineItemId: string;
  dateOfTransaction: string;
  householdId: string;
  userId: string;
  monthKey: string;
  recurrenceFrequency?: string;
}): Promise<{ error: Error | null }> {
  const { monthNumber, yearNumber } = getMonthAndYearNumberFromDate(monthKey);
  const recurringNextDate = computeNextRecurringDate(dateOfTransaction, recurrenceFrequency);

  const { error } = await supabase.from('transactions').insert({
    amount,
    description: description ?? null,
    note: note ?? null,
    date: dateOfTransaction,
    line_item_id: lineItemId,
    year: yearNumber,
    month: monthNumber,
    household_id: householdId,
    created_by: userId,
    recurrence_frequency: recurrenceFrequency,
    recurring_next_date: recurringNextDate,
  });

  if (error) {
    return { error: error };
  }
  return { error: null };
}
