import { logError } from '@/hooks/useLogError';
import { supabase } from '@/lib/supabase';

export async function getCurrentUser(authUserId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', authUserId)
    .maybeSingle();

  if (error) {
    logError(error, { tags: { query: 'getCurrentUser' } });
    return { currentUser: null, error };
  }

  return { currentUser: data, error: null };
}
