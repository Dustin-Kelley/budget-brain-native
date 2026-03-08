import { BackButton } from "@/components/BackButton";
import { EmojiAvatarPicker } from "@/components/EmojiAvatarPicker";
import { UserAvatar } from "@/components/UserAvatar";
import { Text } from "@/components/ui/text";
import { useTheme } from "@/contexts/theme-context";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useUpdateUserProfile } from "@/hooks/useUpdateUserProfile";
import { appThemes } from "@/lib/themes";
import { blendHex } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Modal, Pressable, ScrollView, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function AppearanceScreen() {
  const { appTheme, setAppTheme } = useTheme();
  const { currentUser } = useCurrentUser();
  const { updateUserProfile, isUpdatingUserProfile } = useUpdateUserProfile();
  const insets = useSafeAreaInsets();
  const [emojiModalVisible, setEmojiModalVisible] = useState(false);

  const handleSelect = (emoji: string) => {
    if (!currentUser || isUpdatingUserProfile) return;
    updateUserProfile(
      { userId: currentUser.id, firstName: currentUser.first_name ?? "", lastName: currentUser.last_name ?? "", avatarEmoji: emoji },
    );
  };

  return (
    <SafeAreaView className="flex-1 px-5" edges={["top"]}>
      <View className="gap-4">
        <View className="flex-row items-center gap-3">
          <BackButton />
          <Text className="text-lg font-semibold">Appearance</Text>
        </View>

        <View className="gap-2">
          <Text className="text-base font-semibold text-gray-800">Avatar</Text>
          <Pressable
            onPress={() => setEmojiModalVisible(true)}
            className="items-center gap-2 active:opacity-80"
          >
            <UserAvatar emoji={currentUser?.avatar_emoji} size="lg" />
            <Text className="text-sm text-gray-500">
              {currentUser?.avatar_emoji ? "Tap to change avatar" : "Tap to set avatar"}
            </Text>
          </Pressable>
        </View>

        <Modal
          visible={emojiModalVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setEmojiModalVisible(false)}
        >
          <View className="flex-1 justify-end bg-black/40">
            <View className="h-[70%] rounded-t-2xl bg-white">
              <View className="items-center mt-2 mb-1">
                <View className="h-[5px] w-9 rounded-full bg-gray-300" />
              </View>
              <View className="border-b border-gray-100 px-4 py-3">
                <View className="flex-row items-center justify-between">
                  <Text className="text-lg font-semibold text-gray-800">
                    Choose Avatar
                  </Text>
                  <Pressable
                    onPress={() => setEmojiModalVisible(false)}
                    hitSlop={8}
                    className="h-12 w-12 items-center justify-center rounded-full bg-gray-100/80 active:bg-gray-200"
                  >
                    <Ionicons name="close" size={20} color="#6B7280" />
                  </Pressable>
                </View>
              </View>
              <ScrollView
                className="px-4 py-4"
                contentContainerStyle={{ paddingBottom: 16 + insets.bottom }}
              >
                <EmojiAvatarPicker
                  selected={currentUser?.avatar_emoji}
                  onSelect={(emoji) => {
                    handleSelect(emoji);
                    setEmojiModalVisible(false);
                  }}
                />
              </ScrollView>
            </View>
          </View>
        </Modal>

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
    </SafeAreaView>
  );
}
