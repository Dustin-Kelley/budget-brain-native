import { supabase } from "@/lib/supabase";
import type { UserRow } from "@/types";

export async function getCurrentUser(
  authUserId: string
): Promise<{ currentUser: UserRow | null; error: Error | null }> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", authUserId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return { currentUser: null, error: null };
    }
    return { currentUser: null, error: error as Error };
  }
  return { currentUser: data as UserRow, error: null };
}
