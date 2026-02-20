import { supabase } from '@/lib/supabase';

export async function updateLineItem({
  lineItemId,
  lineItemName,
  categoryId,
  plannedAmount,
}: {
  lineItemId: string;
  lineItemName: string;
  categoryId: string;
  plannedAmount: number;
}): Promise<{ error: Error | null }> {
  const { error } = await supabase
    .from('line_items')
    .update({
      name: lineItemName,
      category_id: categoryId,
      planned_amount: plannedAmount,
    })
    .eq('id', lineItemId);

  if (error) return { error: error as Error };
  return { error: null };
}
