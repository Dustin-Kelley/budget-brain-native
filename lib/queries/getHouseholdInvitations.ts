import { logError } from '@/hooks/useLogError';
import { supabase } from '@/lib/supabase';

export async function getHouseholdInvitations({
  householdId,
}: {
  householdId: string;
}) {
  const { data, error } = await supabase
    .from('household_invitations')
    .select('*')
    .eq('household_id', householdId)
    .eq('status', 'pending');

  if (error) {
    logError(error, { tags: { query: 'getHouseholdInvitations' } });
    return { invitations: [], error: error as Error };
  }

  return { invitations: data ?? [], error: null };
}
