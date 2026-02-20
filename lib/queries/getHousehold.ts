import { supabase } from '@/lib/supabase';

export async function getHousehold(householdId: string | null) {
  if (!householdId) {
    return { household: null, error: null };
  }

  const { data, error } = await supabase
    .from('household')
    .select('*')
    .eq('id', householdId)
    .maybeSingle();

  if (error) {
    console.error(error);
    return { household: null, error };
  }

  return { household: data, error: null };
}
