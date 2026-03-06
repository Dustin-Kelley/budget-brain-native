import { supabase } from '@/lib/supabase';

export async function cancelHouseholdInvitation({
  invitationId,
}: {
  invitationId: string;
}): Promise<{ error: Error | null }> {
  const { error } = await supabase
    .from('household_invitations')
    .delete()
    .eq('id', invitationId);

  if (error) return { error: error as Error };
  return { error: null };
}
