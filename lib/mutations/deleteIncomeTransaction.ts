import { supabase } from '@/lib/supabase';

export async function deleteIncomeTransaction({
  transactionId,
}: {
  transactionId: string;
}): Promise<{ error: Error | null }> {
  const { error } = await supabase
    .from('income_transactions')
    .delete()
    .eq('id', transactionId);

  if (error) return { error: error as Error };
  return { error: null };
}
