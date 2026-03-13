import { useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { computeNextRecurringDate, getMonthAndYearNumberFromDate, getMonthYearString } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';

export function useGenerateRecurringTransactions() {
  const hasRun = useRef(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    generateRecurring().then((generated) => {
      if (generated) {
        queryClient.invalidateQueries();
      }
    });
  }, [queryClient]);
}

async function generateRecurring(): Promise<boolean> {
  const now = new Date().toISOString();
  let generated = false;

  // Process expense transactions
  const { data: dueExpenses } = await supabase
    .from('transactions')
    .select('*')
    .neq('recurrence_frequency', 'never')
    .lte('recurring_next_date', now)
    .is('recurring_parent_id', null);

  if (dueExpenses && dueExpenses.length > 0) {
    for (const tx of dueExpenses) {
      const nextDate = tx.recurring_next_date?.split('T')[0];
      if (!nextDate) continue;

      const monthKey = getMonthYearString(
        new Date(nextDate + 'T12:00:00').getMonth() + 1,
        new Date(nextDate + 'T12:00:00').getFullYear()
      );
      const { monthNumber, yearNumber } = getMonthAndYearNumberFromDate(monthKey);

      await supabase.from('transactions').insert({
        amount: tx.amount,
        description: tx.description,
        note: tx.note,
        date: nextDate,
        line_item_id: tx.line_item_id,
        household_id: tx.household_id,
        created_by: tx.created_by,
        month: monthNumber,
        year: yearNumber,
        is_recurring_instance: true,
        recurring_parent_id: tx.id,
        recurrence_frequency: 'never',
      });

      const advancedDate = computeNextRecurringDate(nextDate, tx.recurrence_frequency);
      await supabase
        .from('transactions')
        .update({ recurring_next_date: advancedDate })
        .eq('id', tx.id);

      generated = true;
    }
  }

  // Process income transactions
  const { data: dueIncome } = await supabase
    .from('income_transactions')
    .select('*')
    .neq('recurrence_frequency', 'never')
    .lte('recurring_next_date', now)
    .is('recurring_parent_id', null);

  if (dueIncome && dueIncome.length > 0) {
    for (const tx of dueIncome) {
      const nextDate = tx.recurring_next_date?.split('T')[0];
      if (!nextDate) continue;

      const monthKey = getMonthYearString(
        new Date(nextDate + 'T12:00:00').getMonth() + 1,
        new Date(nextDate + 'T12:00:00').getFullYear()
      );
      const { monthNumber, yearNumber } = getMonthAndYearNumberFromDate(monthKey);

      await supabase.from('income_transactions').insert({
        amount: tx.amount,
        description: tx.description,
        date: nextDate,
        income_id: tx.income_id,
        household_id: tx.household_id,
        created_by: tx.created_by,
        month: monthNumber,
        year: yearNumber,
        is_recurring_instance: true,
        recurring_parent_id: tx.id,
        recurrence_frequency: 'never',
      });

      const advancedDate = computeNextRecurringDate(nextDate, tx.recurrence_frequency);
      await supabase
        .from('income_transactions')
        .update({ recurring_next_date: advancedDate })
        .eq('id', tx.id);

      generated = true;
    }
  }

  return generated;
}
