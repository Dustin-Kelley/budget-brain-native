import { EmojiAvatarPicker } from "@/components/EmojiAvatarPicker";
import { UserAvatar } from "@/components/UserAvatar";
import { Text } from "@/components/ui/text";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useUpdateUserProfile } from "@/hooks/useUpdateUserProfile";
import { useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AvatarScreen() {
  const { currentUser } = useCurrentUser();
  const updateProfile = useUpdateUserProfile();
  const [saving, setSaving] = useState(false);
  const insets = useSafeAreaInsets();

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
    <ScrollView
      className="flex-1"
      contentContainerStyle={{
        paddingHorizontal: 20,
        paddingBottom: 40,
        paddingTop: insets.top + 56,
      }}
    >
      <View className="gap-8">
        <View className="items-center gap-2">
          <UserAvatar emoji={currentUser?.avatar_emoji} size="lg" />
          <Text className="text-sm text-gray-500">
            {currentUser?.avatar_emoji ? "Your current avatar" : "No avatar set"}
          </Text>
        </View>

        <Text className="text-base font-semibold text-gray-800">
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
