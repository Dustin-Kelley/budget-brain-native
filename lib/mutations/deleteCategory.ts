import { supabase } from '@/lib/supabase';

export async function deleteCategory({
  categoryId,
}: {
  categoryId: string;
}): Promise<{ error: Error | null }> {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', categoryId);

  if (error) return { error: error as Error };
  return { error: null };
}
