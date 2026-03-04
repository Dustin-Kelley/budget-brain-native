import { supabase } from '@/lib/supabase';

export async function getHouseholdMembers({
  householdId,
}: {
  householdId: string;
}): Promise<{
  members: { id: string; email: string | null }[];
  error: Error | null;
}> {
  const { data, error } = await supabase
    .from('users')
    .select('id, email')
    .eq('household_id', householdId);

  if (error) return { members: [], error: error as Error };
  return {
    members: (data ?? []) as { id: string; email: string | null }[],
    error: null,
  };
}
