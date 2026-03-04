import { supabase } from '@/lib/supabase';

export async function addHouseholdMember({
  email,
  householdId,
}: {
  email: string;
  householdId: string;
}): Promise<{ error: Error | null }> {
  // Find user by email
  const { data: user, error: findError } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();

  if (findError) {
    return { error: new Error('No user found with that email address.') };
  }

  // Update their household_id
  const { error: updateError } = await supabase
    .from('users')
    .update({ household_id: householdId })
    .eq('id', user.id);

  if (updateError) return { error: updateError as Error };
  return { error: null };
}
