import { supabase } from '@/lib/supabase';
import { getMonthAndYearNumberFromDate, computeNextRecurringDate } from '@/lib/utils';

export async function addIncomeTransaction({
  amount,
  description,
  dateOfTransaction,
  incomeId,
  householdId,
  userId,
  monthKey,
  recurrenceFrequency = 'never',
}: {
  amount: number;
  description?: string;
  dateOfTransaction: string;
  incomeId: string;
  householdId: string;
  userId: string;
  monthKey: string;
  recurrenceFrequency?: string;
}): Promise<{ error: Error | null }> {
  const { monthNumber, yearNumber } = getMonthAndYearNumberFromDate(monthKey);
  const recurringNextDate = computeNextRecurringDate(dateOfTransaction, recurrenceFrequency);

  const { error } = await supabase.from('income_transactions').insert({
    amount,
    description: description ?? null,
    date: dateOfTransaction,
    income_id: incomeId,
    household_id: householdId,
    created_by: userId,
    month: monthNumber,
    year: yearNumber,
    recurrence_frequency: recurrenceFrequency,
    recurring_next_date: recurringNextDate,
  });

  if (error) return { error: error as Error };
  return { error: null };
}
