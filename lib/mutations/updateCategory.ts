import { supabase } from '@/lib/supabase';

export async function updateCategory({
  categoryId,
  name,
}: {
  categoryId: string;
  name: string;
}): Promise<{ error: Error | null }> {
  const { error } = await supabase
    .from('categories')
    .update({ name })
    .eq('id', categoryId);

  if (error) return { error: error as Error };
  return { error: null };
}
