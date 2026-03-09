import { supabase } from '@/lib/supabase';

export async function updateIncomeTransaction({
  transactionId,
  amount,
  description,
  dateOfTransaction,
}: {
  transactionId: string;
  amount: number;
  description?: string;
  dateOfTransaction: string;
}): Promise<{ error: Error | null }> {
  const { error } = await supabase
    .from('income_transactions')
    .update({
      amount,
      description: description ?? null,
      date: dateOfTransaction,
    })
    .eq('id', transactionId);

  if (error) return { error: error as Error };
  return { error: null };
}
