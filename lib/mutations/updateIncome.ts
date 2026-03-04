import { supabase } from '@/lib/supabase';

export async function updateIncome({
  incomeId,
  name,
  amount,
}: {
  incomeId: string;
  name: string;
  amount: number;
}): Promise<{ error: Error | null }> {
  const { error } = await supabase
    .from('income')
    .update({ name, amount })
    .eq('id', incomeId);

  if (error) return { error: error as Error };
  return { error: null };
}
