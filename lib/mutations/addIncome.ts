import { supabase } from '@/lib/supabase';
import { getMonthAndYearNumberFromDate } from '@/lib/utils';

export async function addIncome({
  incomeName,
  incomeAmount,
  monthKey,
  householdId,
  userId,
}: {
  incomeName: string;
  incomeAmount: number;
  monthKey: string;
  householdId: string;
  userId: string;
}): Promise<{ error: Error | null }> {
  const { monthNumber, yearNumber } = getMonthAndYearNumberFromDate(monthKey);

  const { error } = await supabase.from('income').insert({
    name: incomeName,
    amount: incomeAmount,
    created_by: userId,
    household_id: householdId,
    month: monthNumber,
    year: yearNumber,
  });

  if (error) return { error: error as Error };
  return { error: null };
}
