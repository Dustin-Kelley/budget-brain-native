import { supabase } from '@/lib/supabase';

export async function getCurrentUser(authUserId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', authUserId)
    .single();

  if (error) {
    return { currentUser: null, error };
  }

  return { currentUser: data, error: null };
}
