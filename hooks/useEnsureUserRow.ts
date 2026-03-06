import { useAuth } from '@/contexts/auth-context';
import { logError } from '@/hooks/useLogError';
import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';

/**
 * Ensures a `users` row exists for the current auth user.
 * For new OTP users, the Supabase trigger may not have run yet,
 * so we upsert the row to guarantee it exists.
 */
export function useEnsureUserRow() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['ensureUserRow', user?.id],
    queryFn: async () => {
      const { error } = await supabase
        .from('users')
        .upsert(
          { id: user!.id, email: user!.email },
          { onConflict: 'id', ignoreDuplicates: true }
        );
      if (error) {
        logError(error, { tags: { query: 'ensureUserRow' } });
        throw error;
      }
      return true;
    },
    enabled: !!user?.id,
    staleTime: Infinity,
    retry: 3,
  });
}
