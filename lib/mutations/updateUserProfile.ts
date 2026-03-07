import { supabase } from '@/lib/supabase';

export async function updateUserProfile({
  userId,
  firstName,
  lastName,
  avatarEmoji,
}: {
  userId: string;
  firstName: string;
  lastName: string;
  avatarEmoji?: string | null;
}) {
  const payload: Record<string, unknown> = {
    id: userId,
    first_name: firstName,
    last_name: lastName,
  };
  if (avatarEmoji !== undefined) {
    payload.avatar_emoji = avatarEmoji;
  }
  const { error } = await supabase.from('users').upsert(payload);

  if (error) throw error;
  return;
}
