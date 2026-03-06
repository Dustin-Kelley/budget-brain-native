import { useAuth } from '@/contexts/auth-context';
import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';

/**
 * Ensures a `users` row and linked `household` exist for the current auth user.
 * For new OTP users, the Supabase trigger may not have run yet,
 * so we create both if missing.
 */
export function useEnsureUserRow() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['ensureUserRow', user?.id],
    queryFn: async () => {
      // Check if user row already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id, household_id')
        .eq('id', user!.id)
        .maybeSingle();

      if (existingUser?.household_id) {
        return true;
      }

      // Create household
      let householdId = existingUser?.household_id;
      if (!householdId) {
        const { data: household, error: hError } = await supabase
          .from('household')
          .insert({})
          .select('id')
          .single();
        if (hError) throw hError;
        householdId = household.id;
      }

      // Upsert user row with household link
      const { error } = await supabase
        .from('users')
        .upsert({ id: user!.id, email: user!.email, household_id: householdId });
      if (error) throw error;

      return true;
    },
    enabled: !!user?.id,
    staleTime: Infinity,
    retry: 3,
  });
}
