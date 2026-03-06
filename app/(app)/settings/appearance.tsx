import { BackButton } from "@/components/BackButton";
import { EmojiAvatarPicker } from "@/components/EmojiAvatarPicker";
import { UserAvatar } from "@/components/UserAvatar";
import { Text } from "@/components/ui/text";
import { useTheme } from "@/contexts/theme-context";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useUpdateUserProfile } from "@/hooks/useUpdateUserProfile";
import { appThemes } from "@/lib/themes";
import { blendHex } from "@/lib/utils";
import { getAppTheme } from "@/lib/themes";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Alert, Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AppearanceScreen() {
  const { appTheme, setAppTheme } = useTheme();
  const { currentUser } = useCurrentUser();
  const updateProfile = useUpdateUserProfile();
  const [saving, setSaving] = useState(false);
  const insets = useSafeAreaInsets();
  const theme = getAppTheme(appTheme);
  const accentColor = blendHex(theme.colors[0], theme.colors[1]);

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
        paddingTop: insets.top + 16,
      }}
    >
      <View className="gap-4">
        <View className="flex-row items-center gap-3">
          <BackButton />
          <Text className="text-lg font-semibold">Appearance</Text>
        </View>

        <View className="gap-2">
          <Text className="text-base font-semibold text-gray-800">Avatar</Text>
          <View className="items-center gap-2">
            <UserAvatar emoji={currentUser?.avatar_emoji} size="lg" />
            <Text className="text-sm text-gray-500">
              {currentUser?.avatar_emoji ? "Your current avatar" : "No avatar set"}
            </Text>
          </View>
          <EmojiAvatarPicker
            selected={currentUser?.avatar_emoji}
            onSelect={handleSelect}
          />
        </View>

        <View className="gap-2">
          <Text className="text-base font-semibold text-gray-800">App Theme</Text>
          <View className="flex-row flex-wrap gap-3">
            {appThemes.map((t) => {
              const isSelected = appTheme === t.id;
              const selectedBorder = blendHex(t.colors[0], t.colors[1]);
              return (
                <Pressable
                  key={t.id}
                  onPress={() => setAppTheme(t.id)}
                >
                  <LinearGradient
                    colors={t.colors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 16,
                      borderWidth: isSelected ? 3 : 0,
                      borderColor: isSelected ? selectedBorder : "transparent",
                      ...(isSelected
                        ? {
                            shadowColor: selectedBorder,
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.3,
                            shadowRadius: 4,
                          }
                        : {}),
                    }}
                  />
                  <Text className="mt-1 text-center text-xs text-gray-500">
                    {t.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
