import { supabase } from '@/lib/supabase';

export async function updateCategory({
  categoryId,
  name,
  color,
}: {
  categoryId: string;
  name: string;
  color?: string;
}): Promise<{ error: Error | null }> {
  const { error } = await supabase
    .from('categories')
    .update({ name, ...(color ? { color } : {}) })
    .eq('id', categoryId);

  if (error) return { error: error as Error };
  return { error: null };
}
