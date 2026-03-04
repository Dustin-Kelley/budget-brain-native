import { supabase } from '@/lib/supabase';

export async function deleteIncome({
  incomeId,
}: {
  incomeId: string;
}): Promise<{ error: Error | null }> {
  const { error } = await supabase
    .from('income')
    .delete()
    .eq('id', incomeId);

  if (error) return { error: error as Error };
  return { error: null };
}
