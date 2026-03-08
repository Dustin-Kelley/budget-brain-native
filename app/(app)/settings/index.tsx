import { UserAvatar } from "@/components/UserAvatar";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/contexts/auth-context";
import { useTheme } from "@/contexts/theme-context";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useHousehold } from "@/hooks/useHousehold";
import { getAppTheme } from "@/lib/themes";
import { blendHex } from "@/lib/utils";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const menuItems = [
  {
    label: "Appearance",
    description: "Avatar & app theme",
    icon: "color-palette-outline" as const,
    route: "/(app)/settings/appearance",
  },
  {
    label: "Budget",
    description: "Reset Budget",
    icon: "wallet-outline" as const,
    route: "/(app)/settings/budget",
  },
  {
    label: "Household",
    description: "Manage household members",
    icon: "people-outline" as const,
    route: "/(app)/settings/household",
  },
] as const;

export default function SettingsMenuScreen() {
  const { appTheme } = useTheme();
  const theme = getAppTheme(appTheme);
  const accentColor = blendHex(theme.colors[0], theme.colors[1]);
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { currentUser } = useCurrentUser();
  const { household } = useHousehold();

  const fullName = [currentUser?.first_name, currentUser?.last_name]
    .filter(Boolean)
    .join(" ");

  return (
    <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40, paddingTop: insets.top + 8 }}>
      <Text className="text-lg font-semibold mb-3">Settings</Text>

      <Pressable
        onPress={() => router.push("/(app)/settings/account")}
        className="mb-4 flex-row items-center gap-4 rounded-2xl bg-card p-4 active:opacity-80"
      >
        <UserAvatar emoji={currentUser?.avatar_emoji} size="lg" />
        <View className="flex-1">
          {fullName ? (
            <Text className="text-lg font-semibold text-gray-800">{fullName}</Text>
          ) : (
            <Text className="text-lg font-semibold text-gray-400">No name set</Text>
          )}
          <Text className="text-sm text-muted-foreground">
            {user?.email ?? "\u2014"}
          </Text>
          {household?.name ? (
            <Text className="text-xs text-muted-foreground">
              {household.name}
            </Text>
          ) : null}
        </View>
        <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
      </Pressable>
      <View className="rounded-2xl overflow-hidden bg-card">
        {menuItems.map((item, index) => (
          <Pressable
            key={item.label}
            onPress={() => router.push(item.route)}
            className={`flex-row items-center px-5 py-5 active:opacity-80 ${index < menuItems.length - 1 ? "border-b border-gray-100" : ""}`}
          >
            <View
              className="items-center justify-center rounded-xl"
              style={{ width: 40, height: 40, backgroundColor: accentColor + "18" }}
            >
              <Ionicons name={item.icon} size={22} color={accentColor} />
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-base font-semibold">{item.label}</Text>
              <Text className="text-sm text-muted-foreground">{item.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}
