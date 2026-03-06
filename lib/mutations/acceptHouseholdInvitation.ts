import { supabase } from '@/lib/supabase';

export async function acceptHouseholdInvitation({
  invitationId,
  userId,
  householdId,
}: {
  invitationId: string;
  userId: string;
  householdId: string;
}): Promise<{ error: Error | null }> {
  const { error: updateInviteError } = await supabase
    .from('household_invitations')
    .update({ status: 'accepted' })
    .eq('id', invitationId);

  if (updateInviteError) return { error: updateInviteError as Error };

  const { error: updateUserError } = await supabase
    .from('users')
    .update({ household_id: householdId })
    .eq('id', userId);

  if (updateUserError) return { error: updateUserError as Error };

  return { error: null };
}
