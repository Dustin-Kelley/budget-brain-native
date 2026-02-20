import { supabase } from '@/lib/supabase';

export async function deleteTransaction({
  transactionId,
}: {
  transactionId: string;
}): Promise<{ error: Error | null }> {
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', transactionId);

  if (error) return { error: error as Error };
  return { error: null };
}
