import { logError } from '@/hooks/useLogError';
import { supabase } from '@/lib/supabase';

export async function getPendingInvitesForUser({
  email,
}: {
  email: string;
}) {
  const { data, error } = await supabase
    .from('household_invitations')
    .select('*, household(name), users!invited_by(first_name)')
    .eq('email', email)
    .eq('status', 'pending');

  if (error) {
    logError(error, { tags: { query: 'getPendingInvitesForUser' } });
    return { invitations: [], error: error as Error };
  }

  return { invitations: data ?? [], error: null };
}
