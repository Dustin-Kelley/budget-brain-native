import { supabase } from "@/lib/supabase";
import type { HouseholdRow } from "@/types";

export type GetHouseholdResult = {
  household: HouseholdRow | null;
  householdError: Error | null;
};

export async function getHousehold(
  householdId: string | null
): Promise<GetHouseholdResult> {
  if (!householdId) {
    return { household: null, householdError: null };
  }

  const { data, error } = await supabase
    .from("household")
    .select("*")
    .eq("id", householdId)
    .maybeSingle();

  if (error) {
    return { household: null, householdError: error as Error };
  }

  return { household: data, householdError: null };
}
