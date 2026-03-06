import { supabase } from '@/lib/supabase';

export async function declineHouseholdInvitation({
  invitationId,
}: {
  invitationId: string;
}): Promise<{ error: Error | null }> {
  const { error } = await supabase
    .from('household_invitations')
    .update({ status: 'declined' })
    .eq('id', invitationId);

  if (error) return { error: error };
  return { error: null };
}
