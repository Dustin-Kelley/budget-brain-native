import { supabase } from '@/lib/supabase';

export async function deleteLineItem({
  lineItemId,
}: {
  lineItemId: string;
}): Promise<{ error: Error | null }> {
  const { error } = await supabase
    .from('line_items')
    .delete()
    .eq('id', lineItemId);

  if (error) return { error: error as Error };
  return { error: null };
}
