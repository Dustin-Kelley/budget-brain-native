import { supabase } from '@/lib/supabase';

export async function updateUserProfile({
  userId,
  firstName,
  lastName,
}: {
  userId: string;
  firstName: string;
  lastName: string;
}): Promise<{ error: Error | null }> {
  const { error } = await supabase
    .from('users')
    .update({ first_name: firstName, last_name: lastName })
    .eq('id', userId);

  if (error) return { error: error as Error };
  return { error: null };
}
