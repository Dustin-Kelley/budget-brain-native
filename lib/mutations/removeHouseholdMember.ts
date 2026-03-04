import { supabase } from '@/lib/supabase';

export async function removeHouseholdMember({
  userId,
}: {
  userId: string;
}): Promise<{ error: Error | null }> {
  const { error } = await supabase
    .from('users')
    .update({ household_id: null })
    .eq('id', userId);

  if (error) return { error: error as Error };
  return { error: null };
}
