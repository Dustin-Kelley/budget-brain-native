import { supabase } from '@/lib/supabase';

export async function sendHouseholdInvitation({
  householdId,
  invitedBy,
  email,
  householdName,
  inviterName,
}: {
  householdId: string;
  invitedBy: string;
  email: string;
  householdName: string | null;
  inviterName: string | null;
}): Promise<{ error: Error | null }> {
  const { error: insertError } = await supabase
    .from('household_invitations')
    .insert({
      household_id: householdId,
      invited_by: invitedBy,
      email,
    });

  if (insertError) {
    if (insertError.code === '23505') {
      return { error: new Error('This email has already been invited.') };
    }
    return { error: insertError as Error };
  }

  // Fire-and-forget email send via edge function
  supabase.functions
    .invoke('send-invite-email', {
      body: { email, householdName, inviterName },
    })
    .catch(() => {
      // Email send failure is non-blocking
    });

  return { error: null };
}
