import { supabase } from "@/lib/supabase";
import type { UserRow } from "@/types";

type GetCurrentUserResult = {
  currentUser: UserRow | null;
  error: Error | null;
};

export async function getCurrentUser(
  authUserId: string
): Promise<GetCurrentUserResult> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", authUserId)
    .single();

  if (error) {
    return { currentUser: null, error: error as Error };
  }

  return { currentUser: data, error: null };
}
