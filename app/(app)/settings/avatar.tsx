import { BackButton } from "@/components/BackButton";
import { EmojiAvatarPicker } from "@/components/EmojiAvatarPicker";
import { UserAvatar } from "@/components/UserAvatar";
import { Text } from "@/components/ui/text";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useUpdateUserProfile } from "@/hooks/useUpdateUserProfile";
import { useState } from "react";
import { Alert, ScrollView, View } from "react-native";

export default function AvatarScreen() {
  const { currentUser } = useCurrentUser();
  const updateProfile = useUpdateUserProfile();
  const [saving, setSaving] = useState(false);

  const handleSelect = async (emoji: string) => {
    if (!currentUser || saving) return;
    setSaving(true);
    try {
      await updateProfile.mutateAsync({
        userId: currentUser.id,
        firstName: currentUser.first_name ?? "",
        lastName: currentUser.last_name ?? "",
        avatarEmoji: emoji,
      });
    } catch {
      Alert.alert("Error", "Failed to save avatar.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView className="flex-1" contentContainerStyle={{ padding: 24 }}>
      <View className="gap-6">
        <View className="flex-row items-center gap-2">
          <BackButton />
          <Text variant="h3">Avatar</Text>
        </View>

        <View className="items-center gap-2">
          <UserAvatar emoji={currentUser?.avatar_emoji} size="md" />
          <Text className="text-sm text-gray-500">
            {currentUser?.avatar_emoji ? "Your current avatar" : "No avatar set"}
          </Text>
        </View>

        <Text className="text-base font-semibold text-gray-900">
          Choose an emoji
        </Text>

        <EmojiAvatarPicker
          selected={currentUser?.avatar_emoji}
          onSelect={handleSelect}
        />
      </View>
    </ScrollView>
  );
}
