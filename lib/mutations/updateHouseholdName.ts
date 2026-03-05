import { supabase } from '@/lib/supabase';

export async function updateHouseholdName({
  householdId,
  name,
}: {
  householdId: string;
  name: string;
}): Promise<{ error: Error | null }> {
  const { error } = await supabase
    .from('household')
    .update({ name })
    .eq('id', householdId);

  if (error) return { error: error as Error };
  return { error: null };
}
